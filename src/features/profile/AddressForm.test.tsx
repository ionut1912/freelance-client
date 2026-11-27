import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "user-event-13";

import { fakeApi, renderApp } from "../../testUtils";

import AddressForm from "./AddressForm";

const type = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
const blur = (label: string) => fireEvent.blur(screen.getByLabelText(label));
const button = (name: string) => screen.getByRole("button", { name });
const choose = async (label: string, option: string) => {
  userEvent.click(screen.getByRole("combobox", { name: label }));
  userEvent.click(await screen.findByRole("option", { name: option }));
};

const api = () =>
  fakeApi({
    "GET restcountries": [200, [{ name: { common: "Romania" } }]],
    "POST countriesnow": [200, { data: ["Cluj"] }],
  });

it("loads countries and cities and submits the address", async () => {
  api();
  const onSubmit = jest.fn();
  renderApp(<AddressForm onSubmit={onSubmit} />);

  for (const label of ["Street", "Street Number", "Zip"]) {
    blur(label);
  }
  expect(await screen.findByText("Street is required")).toBeInTheDocument();

  await choose("Country", "Romania");
  await choose("City", "Cluj");
  type("Street", "Main");
  type("Street Number", "1");
  type("Zip", "400000");
  await waitFor(() => expect(button("Save Address")).toBeEnabled());
  userEvent.click(button("Save Address"));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith(
      {
        addressCountry: "Romania",
        addressCity: "Cluj",
        addressStreet: "Main",
        addressStreetNumber: "1",
        addressZip: "400000",
      },
      expect.anything(),
    ),
  );
});

it("requires a city again after clearing it", async () => {
  api();
  renderApp(<AddressForm onSubmit={jest.fn()} />);
  await choose("Country", "Romania");
  await choose("City", "Cluj");
  userEvent.click(screen.getAllByTitle("Clear")[1]);
  expect(await screen.findByText("City is required")).toBeInTheDocument();
});

it("blocks saving after the country is cleared", async () => {
  api();
  renderApp(<AddressForm onSubmit={jest.fn()} />);
  await choose("Country", "Romania");
  await choose("City", "Cluj");
  type("Street", "Main");
  type("Street Number", "1");
  type("Zip", "400000");
  await waitFor(() => expect(button("Save Address")).toBeEnabled());

  userEvent.click(screen.getAllByTitle("Clear")[0]);

  expect(screen.getByRole("combobox", { name: "City" })).toBeDisabled();
  await waitFor(() => expect(button("Save Address")).toBeDisabled(), {
    timeout: 1000,
  });
});

it("stops loading when the country lookup fails", async () => {
  fakeApi({ "GET restcountries": [500] });
  const { store } = renderApp(<AddressForm onSubmit={jest.fn()} />);
  await waitFor(() => expect(store.getState().country.error).not.toBeNull());

  userEvent.click(screen.getByRole("combobox", { name: "Country" }));

  expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
});

it("shows no city spinner before a country is chosen", async () => {
  api();
  renderApp(<AddressForm onSubmit={jest.fn()} />);

  await waitFor(() =>
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument(),
  );
});
