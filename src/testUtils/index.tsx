import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { api } from "../services/utils";
import auth from "../store/auth/slice";
import city from "../store/city/slice";
import country from "../store/country/slice";
import faceVerification from "../store/face-verification/slice";
import language from "../store/language/slice";
import navigation from "../store/navigation/slice";
import skill from "../store/skills/slice";
import userProfile from "../store/user-profile/slice";

const rootReducer = combineReducers({
  auth,
  userProfile,
  faceVerification,
  city,
  country,
  language,
  skill,
  navigation,
});

type State = ReturnType<typeof rootReducer>;

export const makeStore = (overrides: Partial<State> = {}) => {
  const defaults = rootReducer(undefined, { type: "@@init" });
  return configureStore({
    reducer: rootReducer,
    preloadedState: { ...defaults, ...overrides },
  });
};

const LocationProbe = () => (
  <span data-testid="path">{useLocation().pathname}</span>
);

export const renderApp = (
  ui: ReactElement,
  { store = makeStore(), path = "/" } = {},
) => ({
  store,
  ...render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="*" element={ui} />
        </Routes>
        <LocationProbe />
      </MemoryRouter>
    </Provider>,
  ),
});

export const profile = (overrides: object = {}) => ({
  id: 7,
  bio: "Experienced person",
  image: "data:image/png;base64,AAAA",
  isVerified: true,
  user: {
    id: 3,
    username: "ana",
    email: "ana@example.com",
    phoneNumber: "0712345678",
  },
  address: {
    id: 1,
    country: "Romania",
    city: "Cluj",
    street: "Main",
    streetNumber: "1",
    zipCode: "400000",
  },
  ...overrides,
});

export const profileState = (overrides: object = {}) => ({
  clientProfiles: [profile()],
  freelancerProfiles: [profile()],
  paginatedUserProfiles: null,
  error: null,
  loading: false,
  ...overrides,
});

export interface Call {
  method: string;
  url: string;
  data: unknown;
  authorization?: string;
}

type Reply = [status: number, data?: unknown];

/**
 * Replaces the network for both the app's axios instance and the global one.
 * Routes are matched by "METHOD url-substring"; anything else replies 200 {}.
 */
export const fakeApi = (routes: Record<string, Reply> = {}) => {
  const calls: Call[] = [];
  const adapter = async (
    config: InternalAxiosRequestConfig,
  ): Promise<AxiosResponse> => {
    const method = (config.method ?? "get").toUpperCase();
    const url = config.url ?? "";
    calls.push({
      method,
      url,
      data:
        typeof config.data === "string"
          ? (JSON.parse(config.data) as unknown)
          : config.data,
      authorization: config.headers.Authorization as string | undefined,
    });
    const key = Object.keys(routes).find((k) => {
      const [m, part] = k.split(" ");
      return m === method && url.includes(String(part));
    });
    const [status, data = {}] = (key ? routes[key] : undefined) ?? [200];
    const response = {
      data,
      status,
      statusText: String(status),
      headers: {},
      config,
    };
    if (status >= 400) {
      throw new AxiosError(
        `Request failed with status code ${status}`,
        "ERR_BAD_REQUEST",
        config,
        null,
        response,
      );
    }
    return response;
  };
  axios.defaults.adapter = adapter;
  api.defaults.adapter = adapter;
  return calls;
};

/** jsdom has no camera or canvas; install controllable stand-ins. */
export const fakeCamera = ({ cameras = 1 } = {}) => {
  const stop = jest.fn();
  const stream = { getTracks: () => [{ stop }] };
  const mediaDevices = {
    enumerateDevices: jest.fn().mockResolvedValue(
      Array.from({ length: cameras }, (_, i) => ({
        kind: "videoinput",
        label: "front",
        deviceId: String(i),
      })),
    ),
    getUserMedia: jest.fn().mockResolvedValue(stream),
  };
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: mediaDevices,
  });
  const context = { drawImage: jest.fn() };
  const getContext = jest
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context as unknown as CanvasRenderingContext2D);
  const toDataURL = jest
    .spyOn(HTMLCanvasElement.prototype, "toDataURL")
    .mockReturnValue("data:image/png;base64,SHOT");
  return { mediaDevices, stop, getContext, toDataURL };
};

export const fakeHub = () => {
  const handlers: Record<string, (...args: unknown[]) => void> = {};
  const hub = {
    start: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn().mockResolvedValue(undefined),
    invoke: jest.fn().mockResolvedValue(undefined),
    on: jest.fn((name: string, fn: (...args: unknown[]) => void) => {
      handlers[name] = fn;
    }),
    onreconnected: jest.fn((fn: () => void) => {
      handlers.reconnected = fn;
    }),
  };
  return { hub, handlers };
};

/** Every request fails without a response, as when the server is unreachable. */
export const offlineApi = () => {
  const adapter = (config: InternalAxiosRequestConfig) =>
    Promise.reject(new AxiosError("Network Error", "ERR_NETWORK", config));
  axios.defaults.adapter = adapter;
  api.defaults.adapter = adapter;
};
