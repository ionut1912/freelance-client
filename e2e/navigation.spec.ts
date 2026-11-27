import { expect, test } from "@playwright/test";
import { blockUnmockedApi } from "./mockApi";

test.beforeEach(async ({ page }) => {
  await blockUnmockedApi(page);
});

test("shows the 404 page and returns home", async ({ page }) => {
  await page.goto("/does-not-exist");
  await expect(page.getByText("Page Not Found")).toBeVisible();

  await page.getByRole("button", { name: "Return Home" }).click();
  await expect(
    page.getByRole("link", { name: "Join as Client" }),
  ).toBeVisible();
});

test("links from the access denied page to login", async ({ page }) => {
  await page.goto("/unauthorized");
  await expect(page.getByText("Access denied")).toBeVisible();

  await page.getByRole("link", { name: "Go to Login" }).click();
  await expect(page).toHaveURL(/\/login$/);
});

test("redirects a logged-out visitor to login", async ({ page }) => {
  // Known bug: RequireAuth loads the profile before checking authentication,
  // and a rejected load leaves `userProfile.loading` true, so the spinner never
  // goes away. Remove this line once fixed (the test will then "unexpectedly pass").
  test.fail();

  await page.goto("/calendar");
  await expect(page).toHaveURL(/\/login$/);
});
