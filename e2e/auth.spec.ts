import { expect, test, type Page } from "@playwright/test";

import { API, blockUnmockedApi, fakeToken, json } from "./mockApi";

test.beforeEach(async ({ page }) => {
  await blockUnmockedApi(page);
});

const fillRegistration = async (page: Page) => {
  await page.getByLabel("Email").fill("ana@example.com");
  await page.getByLabel("Username").fill("ana");
  await page.getByLabel("PhoneNumber").fill("0712345678");
  await page.getByLabel("Password", { exact: true }).fill("secret1");
};

const fillLogin = async (page: Page) => {
  await page.getByLabel("Username").fill("ana");
  await page.getByLabel("Password", { exact: true }).fill("secret1");
  await page.getByRole("button", { name: "Log In" }).click();
};

test("registers with the chosen role and goes to login", async ({ page }) => {
  await page.route(`${API}/auth/register`, (route) => json(route, {}));

  await page.goto("/");
  await page.getByText("I'm a freelancer, looking for work").click();
  await page.getByRole("link", { name: "Join as Freelancer" }).click();
  await fillRegistration(page);

  const request = page.waitForRequest(`${API}/auth/register`);
  await page.getByRole("button", { name: "Create Account" }).click();

  expect((await request).postDataJSON()).toEqual({
    email: "ana@example.com",
    username: "ana",
    phoneNumber: "0712345678",
    password: "secret1",
    role: "Freelancer",
  });
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("Register successful")).toBeVisible();
});

test("shows backend validation errors on register", async ({ page }) => {
  await page.route(`${API}/auth/register`, (route) =>
    json(
      route,
      { errors: [{ property: "Email", errorMessage: "already taken" }] },
      400,
    ),
  );

  await page.goto("/");
  await page.getByRole("link", { name: "Join as Client" }).click();
  await fillRegistration(page);
  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page.getByText("Email: already taken")).toBeVisible();
  await expect(page).toHaveURL(/\/register$/);
});

test("keeps login disabled until the form is filled", async ({ page }) => {
  await page.goto("/login");
  const submit = page.getByRole("button", { name: "Log In" });

  await expect(submit).toBeDisabled();
  await page.getByLabel("Username").fill("ana");
  await page.getByLabel("Password", { exact: true }).fill("secret1");
  await expect(submit).toBeEnabled();
});

test("shows an error for bad credentials", async ({ page }) => {
  await page.route(`${API}/auth/login`, (route) =>
    json(route, { detail: "Invalid username or password" }, 401),
  );

  await page.goto("/login");
  await fillLogin(page);

  await expect(page.getByText("Invalid username or password")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test("logs a client in and starts profile onboarding", async ({ page }) => {
  await page.route(`${API}/auth/login`, (route) =>
    json(route, { token: fakeToken("Client"), username: "ana" }),
  );
  // An empty profile means the client has not completed onboarding.
  await page.route(`${API}/current/userProfiles`, (route) => json(route, null));
  await page.route("https://countriesnow.space/**", (route) =>
    json(route, { data: [] }),
  );

  await page.goto("/login");
  const profileRequest = page.waitForRequest(`${API}/current/userProfiles`);
  await fillLogin(page);

  await expect(page).toHaveURL(/\/client$/);
  expect((await profileRequest).headers().authorization).toBe(
    `Bearer ${fakeToken("Client")}`,
  );
  await expect(page.getByText("Address Details")).toBeVisible();
});
