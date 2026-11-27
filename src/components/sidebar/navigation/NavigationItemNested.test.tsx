import { screen, waitFor } from "@testing-library/react";
import userEvent from "user-event-13";
import NavigationItemNested from "../../../components/sidebar/navigation/NavigationItemNested";
import { renderApp } from "../../../testUtils";

const item = {
  label: "Group",
  description: "About",
  icon: () => <i />,
  items: [{ path: "/child", label: "Child" }],
};

it("expands and collapses its children", async () => {
  renderApp(<NavigationItemNested item={item} />);
  expect(screen.getByText("About")).toBeInTheDocument();
  expect(screen.queryByText("Child")).toBeNull();

  userEvent.click(screen.getByText("Group"));
  expect(screen.getByText("Child")).toBeInTheDocument();
  userEvent.click(screen.getByText("Group"));
  await waitFor(() => expect(screen.queryByText("Child")).toBeNull());
});

it("omits a missing description", () => {
  renderApp(
    <NavigationItemNested item={{ ...item, description: undefined }} />,
  );
  expect(screen.queryByText("About")).toBeNull();
});
