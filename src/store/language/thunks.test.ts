import { loadLanguages } from "../../store/language/thunks";
import { fakeApi, makeStore } from "../../testUtils";

it("loads languages", async () => {
  fakeApi({ "GET libretranslate": [200, [{ code: "ro" }]] });
  const result = await makeStore().dispatch(loadLanguages());
  expect(result.payload).toEqual({ languages: [{ code: "ro" }] });
});

it("rejects with the error message", async () => {
  fakeApi({ "GET libretranslate": [500] });
  const result = await makeStore().dispatch(loadLanguages());
  expect(result.payload).toBe("Request failed with status code 500");
});
