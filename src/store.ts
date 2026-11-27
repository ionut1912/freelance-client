import { configureStore, combineReducers } from "@reduxjs/toolkit";
import axios from "axios";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";

import authReducer, { logout } from "../src/store/auth/slice";
import cityReducer from "../src/store/city/slice";
import countryReducer from "../src/store/country/slice";
import faceVerificationReducer from "../src/store/face-verification/slice";
import languageReducer from "../src/store/language/slice";
import skillReducer from "../src/store/skills/slice";
import userProfileReducer from "../src/store/user-profile/slice";

import { api } from "./services/utils";
import navigationReducer from "./store/navigation/slice";

const rootReducer = combineReducers({
  auth: authReducer,
  userProfile: userProfileReducer,
  faceVerification: faceVerificationReducer,
  city: cityReducer,
  country: countryReducer,
  language: languageReducer,
  skill: skillReducer,
  navigation: navigationReducer,
});

const persistConfig = {
  key: "root",
  storage: sessionStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

api.interceptors.response.use(undefined, (error: unknown) => {
  if (
    axios.isAxiosError(error) &&
    error.response?.status === 401 &&
    error.config?.headers.Authorization
  ) {
    store.dispatch(logout());
  }
  // Pass the original rejection through unchanged.
  // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
  return Promise.reject(error);
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
