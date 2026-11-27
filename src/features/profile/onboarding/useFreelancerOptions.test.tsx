import { screen } from "@testing-library/react";

import { fakeApi, renderApp } from "../../../testUtils";

import { useFreelancerOptions } from "./useFreelancerOptions";

const Options = () => (
  <p>{useFreelancerOptions().languageOptions.join(", ")}</p>
);

it("tolerates a language entry without a name", async () => {
  fakeApi({
    "GET skills": [200, []],
    "GET libretranslate": [
      200,
      [{ code: "ro", name: "Romanian" }, { code: "xx" }],
    ],
  });

  renderApp(<Options />);

  expect(await screen.findByText(/Romanian/)).toBeInTheDocument();
});
