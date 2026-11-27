import { createTheme, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { makeStore } from "./index";

const CurrentPath = () => (
  <output aria-label="current path">{useLocation().pathname}</output>
);

interface Options {
  store?: ReturnType<typeof makeStore>;
  path?: string;
}

/** Real store, router, query client, theme and toasts around `ui`. */
export const renderWithProviders = (
  ui: ReactElement,
  { store = makeStore(), path = "/" }: Options = {},
) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return {
    store,
    user: userEvent.setup(),
    ...render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={createTheme()}>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route path="*" element={ui} />
              </Routes>
              <CurrentPath />
            </MemoryRouter>
            <ToastContainer />
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>,
    ),
  };
};
