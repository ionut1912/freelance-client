import { createSlice } from "@reduxjs/toolkit";

import { incrementFalseCount, resetFalseCount } from "./actions";
import { verifyCapturedFace } from "./thunks";
import type { FaceVerificationState } from "./types";

const initialState: FaceVerificationState = {
  verifyFaceResult: null,
  falseCount: 0,
  error: null,
};

const faceVerificationSlice = createSlice({
  name: "faceVerification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(incrementFalseCount, (state) => {
        state.falseCount += 1;
      })
      .addCase(resetFalseCount, (state) => {
        state.falseCount = 0;
      })
      .addCase(verifyCapturedFace.fulfilled, (state, action) => {
        state.verifyFaceResult = action.payload;
        state.error = null;
      })
      .addCase(verifyCapturedFace.rejected, (state, action) => {
        state.error = action.error.message as string;
      });
  },
});

export { incrementFalseCount, resetFalseCount };
export default faceVerificationSlice.reducer;
