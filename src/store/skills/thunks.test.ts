import { fakeApi, makeStore } from "../../testUtils";
import { loadSkills } from "../../store/skills/thunks";

it("loads skills", async () => {
  fakeApi({ "GET skills": [200, [{ programmingLanguage: "Go" }]] });
  const result = await makeStore().dispatch(loadSkills());
  expect(result.payload).toEqual({
    skills: [{ programmingLanguage: "Go" }],
  });
});

it("rejects with the error message", async () => {
  fakeApi({ "GET skills": [500] });
  const result = await makeStore().dispatch(loadSkills());
  expect(result.payload).toBe("Request failed with status code 500");
});
