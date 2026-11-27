import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FreelancerDataForm from "../../components/forms/FreelancerDataForm";
import { fakeApi, renderApp } from "../../testUtils";

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
const blur = (label: string) => fireEvent.blur(screen.getByLabelText(label));
const button = (name: string) => screen.getByRole("button", { name });
const choose = async (label: string, option: string) => {
  userEvent.click(screen.getByRole("combobox", { name: label }));
  userEvent.click(await screen.findByRole("option", { name: option }));
};

it("collects and submits freelancer details", async () => {
  fakeApi({
    "GET skills": [200, [{ programmingLanguage: "Go", area: "x" }]],
    "GET libretranslate": [200, [{ code: "ro", name: "Romanian" }]],
  });
  const onSubmit = jest.fn();
  renderApp(<FreelancerDataForm onSubmit={onSubmit} />);

  for (const label of ["Experience", "Rate", "Currency", "Portfolio URL"]) {
    blur(label);
  }
  expect(await screen.findByText("Experience is required")).toBeInTheDocument();

  await choose("Programming Languages", "Go");
  await choose("Foreign Languages", "Romanian");
  type("Experience", "5 years");
  type("Rate", "");
  type("Rate", "50");
  type("Currency", "eur");
  type("Portfolio URL", "https://example.com");
  await waitFor(() => expect(button("Save Freelancer Details")).toBeEnabled());
  userEvent.click(button("Save Freelancer Details"));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ currency: "EUR", rate: 50 }),
      expect.anything(),
    ),
  );
});

const emptyLookups = () =>
  fakeApi({ "GET skills": [200, []], "GET libretranslate": [200, []] });

it.each([
  ["Experience", "ab", "Too short"],
  ["Rate", "-1", "Must be >= 0"],
  ["Rate", "10001", "Too high"],
  ["Currency", "eu", "Use 3-letter code"],
  ["Currency", "12$", "Use 3-letter code"],
  ["Portfolio URL", "not a url", "Invalid URL"],
])("rejects %s '%s'", async (label, value, message) => {
  emptyLookups();
  renderApp(<FreelancerDataForm onSubmit={jest.fn()} />);

  type(label, value);
  blur(label);

  expect(await screen.findByText(message)).toBeInTheDocument();
  expect(button("Save Freelancer Details")).toBeDisabled();
});

it.each(["0", "10000"])("accepts the boundary rate %s", async (rate) => {
  emptyLookups();
  renderApp(<FreelancerDataForm onSubmit={jest.fn()} />);

  type("Rate", "1");
  type("Rate", rate);
  blur("Rate");
  // An error elsewhere proves validation has run.
  blur("Experience");
  await screen.findByText("Experience is required");

  expect(screen.queryByText("Too high")).toBeNull();
  expect(screen.queryByText("Must be >= 0")).toBeNull();
});

// Known bug: the skill and language slices keep `loading` true when a load
// fails. Change `it.failing` to `it` once fixed.
it.failing("offers no options when both lookups fail", async () => {
  fakeApi({ "GET skills": [500], "GET libretranslate": [500] });
  renderApp(<FreelancerDataForm onSubmit={jest.fn()} />);

  userEvent.click(
    screen.getByRole("combobox", { name: "Programming Languages" }),
  );

  expect(await screen.findByText("Fără opțiuni")).toBeInTheDocument();
});
