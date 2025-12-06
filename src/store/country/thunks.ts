import axios, { type AxiosResponse } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface LoadCountriesResult {
  countries: string[];
}

interface CountryApiResponse {
  name: {
    common: string;
  };
}

export const loadCountries = createAsyncThunk<
  LoadCountriesResult,
  void,
  { rejectValue: string }
>("countries/loadCountries", async (_, { rejectWithValue }) => {
  const apiUrl = "https://restcountries.com/v3.1/all?fields=name";

  try {
    const response: AxiosResponse<CountryApiResponse[]> =
      await axios.get<CountryApiResponse[]>(apiUrl);
    const countries: string[] = response.data.map(
      (c: CountryApiResponse) => c.name.common,
    );
    return { countries };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.message || "An error occurred");
    }
    return rejectWithValue("An unexpected error occurred");
  }
});
