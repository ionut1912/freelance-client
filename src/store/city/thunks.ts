import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  LoadCitiesPayload,
  LoadCitiesResult,
} from "../../models/ExternalApis";
import axios, { type AxiosError } from "axios";

interface CitiesApiResponse {
  data: string[];
}

export const loadCities = createAsyncThunk<
  LoadCitiesResult,
  LoadCitiesPayload,
  { rejectValue: string }
>("city/loadCities", async ({ country }, { rejectWithValue }) => {
  try {
    const apiUrl = `https://countriesnow.space/api/v0.1/countries/cities`;
    const response = await axios.post<CitiesApiResponse>(apiUrl, { country });
    const cities: string[] = response.data.data;
    return { cities };
  } catch (error) {
    const err = error as AxiosError;
    return rejectWithValue(err.message);
  }
});
