import { setupServer } from "msw/node";

/** Tests add their own handlers; any request without one fails the test. */
export const server = setupServer();
