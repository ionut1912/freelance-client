import { expect, test, type Page } from "@playwright/test";

import { API, blockUnmockedApi, fakeToken, json } from "./mockApi";

// Chromium's built-in fake camera, so photo capture works without hardware.
test.use({
  permissions: ["camera"],
  launchOptions: {
    args: [
      "--use-fake-device-for-media-stream",
      "--use-fake-ui-for-media-stream",
    ],
  },
});

const profile = {
  id: 7,
  bio: "Experienced person",
  image: "data:image/png;base64,AAAA",
  isVerified: true,
  user: {
    id: 3,
    username: "ana",
    email: "ana@example.com",
    phoneNumber: "0712345678",
  },
  address: {
    id: 1,
    country: "Romania",
    city: "Cluj",
    street: "Main",
    streetNumber: "1",
    zipCode: "400000",
  },
};

test.beforeEach(async ({ page }) => {
  await blockUnmockedApi(page);
  await page.route("https://restcountries.com/**", (route) =>
    json(route, [{ name: { common: "Romania" } }]),
  );
  await page.route("https://countriesnow.space/**", (route) =>
    json(route, { data: ["Cluj"] }),
  );
});

const logIn = async (page: Page, userProfile: object | null) => {
  await page.route(`${API}/auth/login`, (route) =>
    json(route, { token: fakeToken("Client"), username: "ana" }),
  );
  await page.route(`${API}/current/userProfiles`, (route) =>
    json(route, userProfile),
  );

  await page.goto("/login");
  await page.getByLabel("Username").fill("ana");
  await page.getByLabel("Password", { exact: true }).fill("secret1");
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page).toHaveURL(/\/client$/);
};

const openAccount = async (page: Page) => {
  await logIn(page, profile);
  await page.getByRole("button", { name: /^Profile/ }).click();
  await page.getByText("My Profile").click();
  await expect(page).toHaveURL(/\/user-profile$/);
};

const takePhoto = async (page: Page) => {
  await page.getByRole("button", { name: "Start Camera" }).click();
  // A frame must have arrived before it can be captured.
  await page.waitForFunction(
    () => (document.querySelector("video")?.videoWidth ?? 0) > 0,
  );
  await page.getByRole("button", { name: "Capture" }).click();
};

test("completes client onboarding and saves the profile", async ({ page }) => {
  await page.route(`${API}/clientProfiles`, (route) => json(route, {}));
  await logIn(page, null);

  await page.getByRole("combobox", { name: "Country" }).click();
  await page.getByRole("option", { name: "Romania" }).click();
  await page.getByRole("combobox", { name: "City" }).click();
  await page.getByRole("option", { name: "Cluj" }).click();
  await page.getByLabel("Street", { exact: true }).fill("Main");
  await page.getByLabel("Street Number").fill("1");
  await page.getByLabel("Zip").fill("400000");
  await page.getByRole("button", { name: "Save Address" }).click();

  await page.getByLabel("Bio").fill("A long enough biography");
  await takePhoto(page);

  const [request] = await Promise.all([
    page.waitForRequest(`${API}/clientProfiles`, { timeout: 5000 }),
    page
      .getByRole("button", { name: "Save User Details" })
      .click({ timeout: 5000 }),
  ]);

  expect(request.postDataJSON()).toMatchObject({
    address: { addressCountry: "Romania", addressCity: "Cluj" },
    user: { bio: "A long enough biography" },
  });
  await expect(
    page.getByText("Client profile created successfully"),
  ).toBeVisible();
});

test("verifies an unverified client's photo", async ({ page }) => {
  await page.route(`${API}/verifyFace`, (route) =>
    json(route, { isMatch: true }),
  );
  await page.route(`${API}/userProfiles/verify/7`, (route) => json(route, {}));
  await logIn(page, { ...profile, isVerified: false });

  await takePhoto(page);
  const verified = page.waitForRequest(`${API}/userProfiles/verify/7`);
  await page.getByRole("button", { name: "Verify Photo" }).click();

  expect((await verified).method()).toBe("PATCH");
});

test("reports a failed photo verification", async ({ page }) => {
  await page.route(`${API}/verifyFace`, (route) => json(route, {}, 500));
  await logIn(page, { ...profile, isVerified: false });

  await takePhoto(page);
  await page.getByRole("button", { name: "Verify Photo" }).click();

  await expect(
    page.getByText("Face verification failed: Unable to verify face"),
  ).toBeVisible();
});

test("saves edited account details", async ({ page }) => {
  await page.route(`${API}/userProfiles/userData`, (route) => json(route, {}));
  await openAccount(page);

  await page.getByLabel("Bio").fill("A brand new biography");
  const request = page.waitForRequest(`${API}/userProfiles/userData`);
  await page.getByRole("button", { name: "Save changes" }).click();

  expect((await request).postDataJSON()).toMatchObject({
    username: "ana",
    bio: "A brand new biography",
  });
  await expect(page.getByText("Profile updated successfully")).toBeVisible();
});

test("shows why saving account details failed", async ({ page }) => {
  await page.route(`${API}/userProfiles/userData`, (route) =>
    json(route, { detail: "Username already taken" }, 409),
  );
  await openAccount(page);

  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByText("Username already taken")).toBeVisible();
});

test("does not send an invalid email", async ({ page }) => {
  let saves = 0;
  await page.route(`${API}/userProfiles/userData`, (route) => {
    saves += 1;
    return json(route, {});
  });
  await openAccount(page);

  await page.getByLabel("Email").fill("not-an-email");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByText("Invalid email")).toBeVisible();
  expect(saves).toBe(0);
});

test("opens the calendar from the sidebar", async ({ page }) => {
  await logIn(page, profile);

  await page.getByText("Calendar", { exact: true }).click();

  await expect(page).toHaveURL(/\/calendar$/);
  await expect(page.locator(".react-calendar")).toBeVisible();
});

test("logs out back to the login page", async ({ page }) => {
  await logIn(page, profile);

  await page.getByRole("banner").locator("button:has(.MuiAvatar-root)").click();
  await page.getByRole("menuitem", { name: "Logout" }).click();

  await expect(page).toHaveURL(/\/login$/);
  expect(await page.evaluate(() => localStorage.getItem("jwt"))).toBeNull();
});
