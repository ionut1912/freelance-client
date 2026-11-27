import { createTheme, ThemeProvider } from "@mui/material";
import { screen } from "@testing-library/react";
import userEvent from "user-event-13";
import SideBarLayout from "../../components/sidebar/SideBarLayout";
import { renderApp } from "../../testUtils";

jest.mock("../../components/sidebar/ToolbarElements", () => () => (
  <p>toolbar</p>
));

const layout = (
  <SideBarLayout role="Client">
    <p>content</p>
  </SideBarLayout>
);

it("shows the navigation around the page and toggles it", () => {
  const { store } = renderApp(layout);
  expect(screen.getByText("content")).toBeInTheDocument();
  expect(screen.getByText("toolbar")).toBeInTheDocument();
  expect(screen.getByText("Calendar")).toBeInTheDocument();

  userEvent.click(screen.getByTestId("ChevronLeftIcon"));
  expect(store.getState().navigation.isSidebarOpen).toBe(false);
  userEvent.click(screen.getByLabelText("open navigation"));
  expect(store.getState().navigation.isSidebarOpen).toBe(true);
});

it("flips the close arrow for right-to-left themes", () => {
  renderApp(
    <ThemeProvider theme={createTheme({ direction: "rtl" })}>
      {layout}
    </ThemeProvider>,
  );
  expect(screen.getByTestId("ChevronRightIcon")).toBeInTheDocument();
});
