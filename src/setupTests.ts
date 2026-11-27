// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { act } from "@testing-library/react";
import { toast } from "react-toastify";

import { server } from "./testUtils/server";

const unhandled: string[] = [];

beforeAll(() =>
  server.listen({
    onUnhandledRequest: (request, print) => {
      unhandled.push(`${request.method} ${request.url}`);
      print.error();
    },
  }),
);

afterEach(() => {
  server.resetHandlers();
  server.events.removeAllListeners();
  act(() => toast.dismiss());
  localStorage.clear();
  sessionStorage.clear();
  jest.useRealTimers();
  jest.restoreAllMocks();
  expect(unhandled.splice(0)).toEqual([]);
});

afterAll(() => server.close());
