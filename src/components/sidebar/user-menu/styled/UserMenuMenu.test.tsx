import { render, screen } from "@testing-library/react";
import { UserMenuMenu } from "../../../../components/sidebar/user-menu/styled/UserMenuMenu";

it("renders a menu when open", () => {
  render(
    <UserMenuMenu open anchorEl={document.body}>
      <li>item</li>
    </UserMenuMenu>,
  );
  expect(screen.getByRole("menu")).toHaveTextContent("item");
});
