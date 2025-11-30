import type { AxiosResponse } from "axios";
import axios from "axios";
import type { Language } from "../models/ExternalApis";

export default function getLanguages(): Promise<AxiosResponse<Language[]>> {
  const apiUrl = "https://libretranslate.com/languages";
  return axios.get<Language[]>(`${apiUrl}`);
}
