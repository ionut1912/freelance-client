import { persistor, store } from "./store";
import { setRole } from "./store/auth/slice";

it("combines every slice", () => {
  expect(Object.keys(store.getState())).toEqual(
    expect.arrayContaining([
      "auth",
      "userProfile",
      "faceVerification",
      "city",
      "country",
      "language",
      "skill",
      "navigation",
    ]),
  );
});

it("persists state to session storage", async () => {
  store.dispatch(setRole("Client"));
  await persistor.flush();
  expect(sessionStorage.getItem("persist:root")).toContain("Client");
});
