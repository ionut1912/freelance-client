import { expect, test, type Page } from "@playwright/test";
import { API, blockUnmockedApi, fakeToken, json } from "./mockApi";

type Role = "Client" | "Freelancer";

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
  await page.route("https://countriesnow.space/**", (route) =>
    json(route, { data: [] }),
  );
  await page.route("https://restcountries.com/**", (route) => json(route, []));
});

const logIn = async (page: Page, role: Role, userProfile: object | null) => {
  await page.route(`${API}/auth/login`, (route) =>
    json(route, { token: fakeToken(role), username: "ana" }),
  );
  await page.route(`${API}/current/userProfiles`, (route) =>
    json(route, userProfile),
  );

  await page.goto("/login");
  await page.getByLabel("Username").fill("ana");
  await page.getByLabel("Password", { exact: true }).fill("secret1");
  await page.getByRole("button", { name: "Log In" }).click();
};

for (const role of ["Client", "Freelancer"] as const) {
  const path = new RegExp(`/${role.toLowerCase()}$`);

  test(`takes a verified ${role} past onboarding`, async ({ page }) => {
    await logIn(page, role, profile);

    await expect(page).toHaveURL(path);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByText("Address Details")).toBeHidden();
  });

  test(`starts onboarding for a new ${role}`, async ({ page }) => {
    await logIn(page, role, null);

    await expect(page).toHaveURL(path);
    await expect(page.getByText("Address Details")).toBeVisible();
    await expect(page.getByRole("button", { name: "Back" })).toBeDisabled();
  });
}

test("keeps the address step blocked until it is complete", async ({
  page,
}) => {
  await logIn(page, "Client", null);
  await page.getByLabel("Street", { exact: true }).fill("Main");

  await expect(
    page.getByRole("button", { name: "Save Address" }),
  ).toBeDisabled();
});
