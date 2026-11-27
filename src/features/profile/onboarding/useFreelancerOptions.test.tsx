import { screen } from "@testing-library/react";

import { fakeApi, renderApp } from "../../../testUtils";

import { useFreelancerOptions } from "./useFreelancerOptions";

const Options = () => (
  <p>{useFreelancerOptions().languageOptions.join(", ")}</p>
);

it("accepts plain names and skips entries without one", async () => {
  fakeApi({
    "GET skills": [200, []],
    "GET libretranslate": [
      200,
      [{ code: "ro", name: "Romanian" }, "English", { code: "xx" }],
    ],
  });

  renderApp(<Options />);

  expect(await screen.findByText("English, Romanian")).toBeInTheDocument();
});
