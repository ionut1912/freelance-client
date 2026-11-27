import { createSlice } from "@reduxjs/toolkit";

import { loadCities } from "./thunks";
import type { CityState } from "./types";

const initialState: CityState = {
  cities: [],
  loading: true,
  error: null,
};

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCities.pending, (state, action) => {
        state.requestId = action.meta.requestId;
        state.cities = [];
        state.loading = true;
      })
      .addCase(loadCities.fulfilled, (state, action) => {
        if (state.requestId !== action.meta.requestId) {
          return;
        }
        state.cities = action.payload.cities;
        state.error = null;
        state.loading = false;
      })
      .addCase(loadCities.rejected, (state, action) => {
        if (state.requestId !== action.meta.requestId) {
          return;
        }
        state.error = action.payload ?? (action.error.message as string);
        state.loading = false;
      });
  },
});
export default citySlice.reducer;
