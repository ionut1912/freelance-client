import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

import type { PaginatedDataRequest, UpdateUserRequest } from "../../models/Ui";
import type {
  CreateClientProfileRequest,
  CreateFreelancerProfileRequest,
  PatchUserProfileAddressRequest,
  PatchFreelancerProfielRequest,
  ClientProfileDto,
  FreelancerProfileDto,
} from "../../models/UserProfile";
import { createClientProfile } from "../../services/clientProfileService";
import {
  createFreelancerProfile,
  updateFreelancerProfileData,
} from "../../services/freelancerProfileService";
import {
  deleteUserProfile,
  getCurrentUserProfile,
  getUserProfiles,
  updateImage,
  updateUserData,
  updateUserProfileAddress,
} from "../../services/userProfileService";
import type { AppDispatch, RootState } from "../../store";
import { extractErrorMessages } from "../../utils/httpError";

export const loadCurrentUserProfile = createAsyncThunk<
  {
    clientProfiles?: ClientProfileDto[];
    freelancerProfiles?: FreelancerProfileDto[];
  },
  undefined,
  { state: RootState; rejectValue: number | undefined }
>("userProfile/loadCurrentUserProfile", async (_, thunkApi) => {
  const { getState, rejectWithValue } = thunkApi;
  let response;
  try {
    response = await getCurrentUserProfile();
  } catch (error) {
    return rejectWithValue((error as AxiosError).response?.status);
  }
  const role = getState().auth.role;
  if (role === "Client") {
    const dto = response.data as ClientProfileDto;
    return {
      clientProfiles: [dto],
      freelancerProfiles: [],
    };
  }
  if (role === "Freelancer") {
    const dto = response.data as FreelancerProfileDto;
    return {
      clientProfiles: [],
      freelancerProfiles: [dto],
    };
  }

  return { clientProfiles: [], freelancerProfiles: [] };
});

export const patchImage = createAsyncThunk<
  undefined,
  string,
  { rejectValue: AxiosError; dispatch: AppDispatch }
>(
  "userProfile/patchUserProfileImage",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await updateImage(payload);
      toast.success("Image updated successfully");
      void dispatch(loadCurrentUserProfile());
    } catch (error) {
      const messages = extractErrorMessages(error);
      messages.forEach((m) => toast.error(m));
      return rejectWithValue(error as AxiosError);
    }
  },
);

export const saveClientProfile = createAsyncThunk<
  undefined,
  CreateClientProfileRequest,
  { rejectValue: AxiosError; dispatch: AppDispatch }
>(
  "userProfile/saveClientProfile",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await createClientProfile(payload);
      toast.success("Client profile created successfully");
      void dispatch(loadCurrentUserProfile());
    } catch (error) {
      const messages = extractErrorMessages(error);
      messages.forEach((m) => toast.error(m));
      return rejectWithValue(error as AxiosError);
    }
  },
);

export const saveFreelancerProfile = createAsyncThunk<
  undefined,
  CreateFreelancerProfileRequest,
  { rejectValue: AxiosError; dispatch: AppDispatch }
>(
  "userProfile/saveFreelancerProfile",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await createFreelancerProfile(payload);
      toast.success("Freelancer profile created successfully");
      void dispatch(loadCurrentUserProfile());
    } catch (error) {
      const messages = extractErrorMessages(error);
      messages.forEach((m) => toast.error(m));
      return rejectWithValue(error as AxiosError);
    }
  },
);

export const removeUserProfile = createAsyncThunk<
  undefined,
  number,
  { state: RootState; rejectValue: AxiosError }
>(
  "userProfile/removeUserProfile",
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      await deleteUserProfile(id);
      const role = getState().auth.role;
      if (role === "Client") {
        dispatch({
          type: "userProfile/deleteClientProfileSuccess",
          payload: id,
        });
      }
      if (role === "Freelancer") {
        dispatch({
          type: "userProfile/deleteFreelancerProfileSuccess",
          payload: id,
        });
      }
    } catch (error) {
      return rejectWithValue(error as AxiosError);
    }
  },
);

export const patchUserData = createAsyncThunk<
  undefined,
  UpdateUserRequest,
  { rejectValue: AxiosError; dispatch: AppDispatch }
>(
  "userProfile/patchUserData",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await updateUserData(payload);
      toast.success("Profile updated successfully");
      void dispatch(loadCurrentUserProfile());
    } catch (error) {
      const messages = extractErrorMessages(error);
      messages.forEach((m) => toast.error(m));
      return rejectWithValue(error as AxiosError);
    }
  },
);

export const patchUserProfileAddress = createAsyncThunk<
  undefined,
  PatchUserProfileAddressRequest,
  { rejectValue: AxiosError; dispatch: AppDispatch }
>(
  "userProfile/patchUserProfileAddress",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await updateUserProfileAddress(payload);
      toast.success("Address updated successfully");
      void dispatch(loadCurrentUserProfile());
    } catch (error) {
      const messages = extractErrorMessages(error);
      messages.forEach((m) => toast.error(m));
      return rejectWithValue(error as AxiosError);
    }
  },
);

export const patchFreelancerData = createAsyncThunk<
  undefined,
  PatchFreelancerProfielRequest,
  { rejectValue: AxiosError; dispatch: AppDispatch }
>(
  "userProfile/patchFreelancerData",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await updateFreelancerProfileData(payload);
      toast.success("Freelancer details updated successfully");
      void dispatch(loadCurrentUserProfile());
    } catch (error) {
      const messages = extractErrorMessages(error);
      messages.forEach((m) => toast.error(m));
      return rejectWithValue(error as AxiosError);
    }
  },
);
export const getUserProfilesData = createAsyncThunk<
  undefined,
  PaginatedDataRequest,
  { rejectValue: AxiosError }
>(
  "userProfile/getUserProfilesData",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await getUserProfiles(payload);
      dispatch({
        type: "userProfile/getUserProfilesSuccess",
        payload: response.data,
      });
    } catch (error) {
      return rejectWithValue(error as AxiosError);
    }
  },
);
