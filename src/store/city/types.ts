export interface CityState {
  cities: string[];
  loading: boolean;
  requestId?: string;
  error: string | null;
}
