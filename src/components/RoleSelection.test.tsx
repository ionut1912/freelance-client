import { fireEvent, screen } from "@testing-library/react";
import RoleSelection from "../components/RoleSelection";
import { renderApp } from "../testUtils";

it.each([
  ["I'm a client, hiring for a project", "Client"],
  ["I'm a freelancer, looking for work", "Freelancer"],
])("joins with the role chosen by '%s'", (card, role) => {
  const { store } = renderApp(<RoleSelection />);
  fireEvent.click(screen.getByText(card));
  fireEvent.click(screen.getByRole("link", { name: `Join as ${role}` }));
  expect(store.getState().auth.role).toBe(role);
  expect(screen.getByTestId("path")).toHaveTextContent("/register");
});

it("defaults to Client when nothing is chosen", () => {
  const { store } = renderApp(<RoleSelection />);

  fireEvent.click(screen.getByRole("link", { name: "Join as Client" }));

  expect(store.getState().auth.role).toBe("Client");
});

it("goes to login without setting a role", () => {
  const { store } = renderApp(<RoleSelection />);

  fireEvent.click(
    screen.getByRole("link", { name: /Already have an account/ }),
  );

  expect(screen.getByTestId("path")).toHaveTextContent("/login");
  expect(store.getState().auth.role).toBeNull();
});
