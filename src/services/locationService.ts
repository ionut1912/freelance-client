import axios, { type AxiosResponse } from "axios";

interface CountryApiResponse {
  name: {
    common: string;
  };
}

interface CitiesApiResponse {
  data: string[];
}

export function getCountries(): Promise<AxiosResponse<CountryApiResponse[]>> {
  const apiUrl = "https://restcountries.com/v3.1/all?fields=name";
  return axios.get<CountryApiResponse[]>(apiUrl);
}

export function getCities(
  country: string,
): Promise<AxiosResponse<CitiesApiResponse>> {
  const apiUrl = "https://countriesnow.space/api/v0.1/countries/cities";
  return axios.post<CitiesApiResponse>(apiUrl, { country });
}
