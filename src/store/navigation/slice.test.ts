import reducer, {
  toggleNavigationId,
  toggleSidebar,
} from "../../store/navigation/slice";

it("toggles the sidebar", () => {
  expect(reducer(undefined, toggleSidebar()).isSidebarOpen).toBe(false);
});

it("opens and closes a navigation group", () => {
  const opened = reducer(undefined, toggleNavigationId("a"));
  expect(opened.openNavigationIds).toEqual(["a"]);
  expect(reducer(opened, toggleNavigationId("a")).openNavigationIds).toEqual(
    [],
  );
});
