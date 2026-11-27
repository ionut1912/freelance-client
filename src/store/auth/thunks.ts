import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import type { NavigateFunction } from "react-router";
import { toast } from "react-toastify";

import type { RegisterDto, LoginDto, UserDto } from "../../models/Accounts";
import { routesLinks } from "../../routes/index";
import {
  register,
  login,
  blockAccount,
  deleteAccount,
  deleteCurrentAccount,
} from "../../services/authService";
import { getRoleFromToken, navigateByRole } from "../../utils/authUtils";
import { toastErrors } from "../../utils/toastErrors";

export const registerUser = createAsyncThunk<
  undefined,
  { payload: RegisterDto; navigate: NavigateFunction },
  { rejectValue: AxiosError }
>("auth/registerUser", async ({ payload, navigate }, { rejectWithValue }) => {
  try {
    await register(payload);
    toast.success("Register successful");
    await navigate(routesLinks.login);
  } catch (error) {
    toastErrors(error);
    return rejectWithValue(error as AxiosError);
  }
});

export const loginUser = createAsyncThunk<
  { user: UserDto; role: string | null } | null,
  { payload: LoginDto; navigate: NavigateFunction },
  { rejectValue: AxiosError }
>("auth/loginUser", async ({ payload, navigate }, { rejectWithValue }) => {
  try {
    const response = await login(payload);
    const token = response.data.token;
    if (!token) {
      throw new Error("Login response has no token");
    }
    localStorage.setItem("jwt", token);
    const role = getRoleFromToken(token);
    navigateByRole(role, navigate);
    return { user: response.data, role };
  } catch (error) {
    toastErrors(error);
    return rejectWithValue(error as AxiosError);
  }
});

export const blockUserAccount = createAsyncThunk<
  undefined,
  { id: number; navigate: NavigateFunction },
  { rejectValue: AxiosError }
>("auth/blockUserAccount", async ({ id, navigate }, { rejectWithValue }) => {
  try {
    await blockAccount(id);
    toast.error("Account blocked");
    await navigate(routesLinks.login);
  } catch (error) {
    toastErrors(error);
    return rejectWithValue(error as AxiosError);
  }
});

export const deleteUserAccount = createAsyncThunk<
  undefined,
  number,
  { rejectValue: AxiosError }
>("auth/deleteUserAccount", async (id, { rejectWithValue }) => {
  try {
    await deleteAccount(id);
  } catch (error) {
    toastErrors(error);
    return rejectWithValue(error as AxiosError);
  }
});

export const deleteCurrentUserAccount = createAsyncThunk<
  undefined,
  { navigate: NavigateFunction },
  { rejectValue: AxiosError }
>(
  "auth/deleteCurrentUserAccount",
  async ({ navigate }, { rejectWithValue }) => {
    try {
      await deleteCurrentAccount();
      await navigate(routesLinks.home);
    } catch (error) {
      toastErrors(error);
      return rejectWithValue(error as AxiosError);
    }
  },
);
