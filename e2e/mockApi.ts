import type { Page, Route } from "@playwright/test";

// Matches REACT_APP_API_BASE set in playwright.config.ts. No backend runs in CI.
export const API = "https://localhost:7020/api";

const cors = { "access-control-allow-origin": "*" };

export const json = (route: Route, body: unknown, status = 200) =>
  route.fulfill({ status, json: body, headers: cors });

/** Fails any API call a test did not explicitly mock. Call this first. */
export const blockUnmockedApi = (page: Page) =>
  page.route(`${API}/**`, (route) =>
    json(route, { detail: "Not mocked" }, 401),
  );

export const fakeToken = (role: "Client" | "Freelancer") => {
  const claims = {
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": role,
  };
  return `h.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.s`;
};
