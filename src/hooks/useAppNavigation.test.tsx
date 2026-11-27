import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";

import { useAppNavigation } from "../hooks/useAppNavigation";
import { makeStore } from "../testUtils";

it("toggles the sidebar and navigation groups", () => {
  const store = makeStore();
  const wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );
  const { result } = renderHook(() => useAppNavigation(), { wrapper });

  act(() => {
    result.current.toggleSidebar();
    result.current.toggleNavigationId("a");
  });

  expect(result.current.isSidebarOpen).toBe(false);
  expect(result.current.getIsOpen("a")).toBe(true);
  expect(result.current.getIsOpen("b")).toBe(false);
});
