import { createAuthAxios } from "../utils/authUtils";

export const API_URL = process.env.REACT_APP_API_BASE ?? "";
export const api = createAuthAxios(API_URL);
