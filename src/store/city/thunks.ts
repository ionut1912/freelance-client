import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

import type {
  LoadCitiesPayload,
  LoadCitiesResult,
} from "../../models/ExternalApis";
import { getCities } from "../../services/locationService";

export const loadCities = createAsyncThunk<
  LoadCitiesResult,
  LoadCitiesPayload,
  { rejectValue: string }
>("city/loadCities", async ({ country }, { rejectWithValue }) => {
  try {
    const response = await getCities(country);
    const cities: string[] = response.data.data;
    return { cities };
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.message);
  }
});
