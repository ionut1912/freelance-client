import { renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { useCurrentUser } from "../hooks/useCurerentUser";
import { fakeApi, makeStore, profile } from "../testUtils";

it("loads the profile of the signed-in role", async () => {
  fakeApi({ "GET current": [200, profile()] });
  const store = makeStore({
    auth: { user: null, role: "Client", error: null },
  });
  const wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );
  const { result } = renderHook(() => useCurrentUser(), { wrapper });

  expect(result.current.loading).toBe(true);
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.clientProfile?.id).toBe(7);
  expect(result.current.freelancerProfile).toBeUndefined();
});
