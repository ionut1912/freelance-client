import { screen } from "@testing-library/react";
import NavigationItem from "../../../components/sidebar/navigation/NavigationItem";
import { renderApp } from "../../../testUtils";

const icon = () => <i />;

it.each([
  ["header", { header: "Header" }, "Header"],
  ["link", { path: "/x", label: "Link", icon }, "Link"],
  ["group", { label: "Group", icon, items: [] }, "Group"],
])("renders a %s", (_kind, item, text) => {
  renderApp(<NavigationItem item={item} />);
  expect(screen.getByText(text)).toBeInTheDocument();
});
