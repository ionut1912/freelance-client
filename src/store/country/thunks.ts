import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { getCountries } from "../../services/locationService";

export interface LoadCountriesResult {
  countries: string[];
}

export const loadCountries = createAsyncThunk<
  LoadCountriesResult,
  undefined,
  { rejectValue: string }
>("countries/loadCountries", async (_, { rejectWithValue }) => {
  try {
    const response = await getCountries();
    const countries: string[] = response.data.map((c) => c.name.common);
    return { countries };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.message || "An error occurred");
    }
    return rejectWithValue("An unexpected error occurred");
  }
});
