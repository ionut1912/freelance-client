import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfileState } from "./types";
import {
  loadCurrentUserProfile,
  saveClientProfile,
  saveFreelancerProfile,
  patchUserProfileAddress,
  patchImage,
} from "./thunks";
import { logout } from "../auth/slice";
import { deleteCurrentUserAccount } from "../auth/thunks";
import type { PaginatedList } from "../../models/Ui";

const initialState: UserProfileState = {
  clientProfiles: null,
  freelancerProfiles: null,
  paginatedUserProfiles: null,
  error: null,
  loading: true,
  loadFailed: false,
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    deleteClientProfileSuccess: (state, action: PayloadAction<number>) => {
      state.clientProfiles =
        state.clientProfiles?.filter((p) => p.id !== action.payload) ?? null;
    },
    deleteFreelancerProfileSuccess: (state, action: PayloadAction<number>) => {
      state.freelancerProfiles =
        state.freelancerProfiles?.filter((p) => p.id !== action.payload) ??
        null;
    },
    getUserProfilesSuccess: (
      state,
      action: PayloadAction<PaginatedList<object>>,
    ) => {
      state.paginatedUserProfiles = action.payload;
    },
    verifyClientProfile: (state, action: PayloadAction<number>) => {
      if (state.clientProfiles) {
        state.clientProfiles = state.clientProfiles.map((profile) =>
          profile.id === action.payload
            ? { ...profile, isVerified: true }
            : profile,
        );
      }
    },
    verifreelancerProfile: (state, action: PayloadAction<number>) => {
      if (state.freelancerProfiles) {
        state.freelancerProfiles = state.freelancerProfiles.map((profile) =>
          profile.id === action.payload
            ? { ...profile, isVerified: true }
            : profile,
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCurrentUserProfile.fulfilled, (state, action) => {
        state.clientProfiles = action.payload.clientProfiles ?? null;
        state.freelancerProfiles = action.payload.freelancerProfiles ?? null;
        state.loading = false;
        state.loadFailed = false;
      })
      .addCase(loadCurrentUserProfile.rejected, (state, action) => {
        state.loading = false;
        // A 4xx means there is no profile yet; anything else is a failure.
        const status = action.payload;
        state.loadFailed = status === undefined || status >= 500;
      })
      .addCase(logout, () => initialState)
      .addCase(deleteCurrentUserAccount.fulfilled, () => initialState)
      .addCase(saveClientProfile.rejected, (state, action) => {
        state.error = action.payload ?? null;
      })
      .addCase(saveFreelancerProfile.rejected, (state, action) => {
        state.error = action.payload ?? null;
      })
      .addCase(patchUserProfileAddress.rejected, (state, action) => {
        state.error = action.payload ?? null;
      })
      .addCase(patchImage.rejected, (state, action) => {
        state.error = action.payload ?? null;
      });
  },
});
export const { verifyClientProfile, verifreelancerProfile } =
  userProfileSlice.actions;
export default userProfileSlice.reducer;
