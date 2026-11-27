import { createAction } from "@reduxjs/toolkit";

// Defined apart from the slice so that thunks.ts does not import slice.ts.
export const incrementFalseCount = createAction(
  "faceVerification/incrementFalseCount",
);
export const resetFalseCount = createAction("faceVerification/resetFalseCount");
