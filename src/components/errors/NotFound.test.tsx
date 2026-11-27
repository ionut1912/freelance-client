import { screen } from "@testing-library/react";
import userEvent from "user-event-13";
import NotFound from "../../components/errors/NotFound";
import { store } from "../../store";
import { setRole } from "../../store/auth/slice";
import { renderApp } from "../../testUtils";

// isAuthenticated reads the app store, so render against it too.
const returnHome = () => {
  renderApp(<NotFound />, { store: store as never, path: "/lost" });
  userEvent.click(screen.getByRole("button", { name: "Return Home" }));
  return screen.getByTestId("path").textContent;
};

it("returns a visitor to the home page", () => {
  expect(returnHome()).toBe("/");
});

it("returns a signed-in client to their page", () => {
  store.dispatch(setRole("Client"));
  expect(returnHome()).toBe("/client");
});
