import { screen } from "@testing-library/react";
import userEvent from "user-event-13";
import NavigationItemSimple from "../../../components/sidebar/navigation/NavigationItemSimple";
import { renderApp } from "../../../testUtils";

const base = { path: "/x", label: "Item", icon: () => <i>icon</i> };

it("navigates when clicked", () => {
  renderApp(<NavigationItemSimple item={base} />);
  userEvent.click(screen.getByText("Item"));
  expect(screen.getByTestId("path")).toHaveTextContent("/x");
  expect(screen.getByText("icon")).toBeInTheDocument();
});

it("shows a dot instead of an icon when nested", () => {
  renderApp(<NavigationItemSimple item={base} nested animateOn />);
  expect(screen.queryByText("icon")).toBeNull();
  expect(screen.getByTestId("CircleIcon")).toBeInTheDocument();
});

it("shows a description and badge", () => {
  renderApp(
    <NavigationItemSimple
      item={{ ...base, description: "More", badgeText: "9" }}
    />,
  );
  expect(screen.getByText("More")).toBeInTheDocument();
  expect(screen.getByText("9")).toBeInTheDocument();
});

it("shows a launch icon for external links", () => {
  renderApp(<NavigationItemSimple item={{ ...base, external: true }} />);
  expect(screen.getByTestId("LaunchIcon")).toBeInTheDocument();
});
