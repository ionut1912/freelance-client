import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { Suspense, type PropsWithChildren } from "react";

import calendar from "../components/calendar/calendar.json";
import { useCalendar } from "../hooks/useCalendar";

it("parses the calendar dates", async () => {
  const client = new QueryClient();
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={client}>
      <Suspense fallback={null}>{children}</Suspense>
    </QueryClientProvider>
  );
  const { result } = renderHook(() => useCalendar(), { wrapper });

  await waitFor(() =>
    expect(result.current.data).toHaveLength(calendar.length),
  );
  const first = result.current.data[0];
  expect(first.date).toBeInstanceOf(Date);
  expect(first.events[0].startDate).toBeInstanceOf(Date);
  expect(first.events[0].endDate).toBeInstanceOf(Date);
});
