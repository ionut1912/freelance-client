import { fakeApi, offlineApi } from "../testUtils";
import getLanguages from "../services/languageService";

afterEach(() => localStorage.clear());

it("fetches languages from libretranslate", async () => {
  const calls = fakeApi({ "GET libretranslate": [200, [{ code: "ro" }]] });

  const response = await getLanguages();

  expect(response.data).toEqual([{ code: "ro" }]);
  expect(calls[0]?.url).toBe("https://libretranslate.com/languages");
});

it("never sends the app token to the third party", async () => {
  localStorage.setItem("jwt", "abc");
  const calls = fakeApi();

  await getLanguages();

  expect(calls[0]?.authorization).toBeUndefined();
});

it("returns an empty list unchanged", async () => {
  fakeApi({ "GET libretranslate": [200, []] });

  await expect(getLanguages()).resolves.toMatchObject({ data: [] });
});

it.each([429, 500])("rejects on HTTP %i", async (status) => {
  fakeApi({ "GET libretranslate": [status] });

  await expect(getLanguages()).rejects.toMatchObject({ response: { status } });
});

it("rejects when the service is unreachable", async () => {
  offlineApi();

  await expect(getLanguages()).rejects.toMatchObject({ code: "ERR_NETWORK" });
});
