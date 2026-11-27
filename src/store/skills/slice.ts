import { createSlice } from "@reduxjs/toolkit";

import { loadSkills } from "./thunks";
import type { SkillsState } from "./types";

const initialState: SkillsState = {
  skills: [],
  loading: true,
  error: null,
};
const skillsSlice = createSlice({
  name: "skill",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSkills.fulfilled, (state, action) => {
        state.skills = action.payload.skills;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadSkills.rejected, (state, action) => {
        state.error = action.payload ?? (action.error.message as string);
        state.loading = false;
      });
  },
});

export default skillsSlice.reducer;
