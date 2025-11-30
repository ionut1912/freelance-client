import type { AxiosError } from "axios";
import type { Language } from "../../models/ExternalApis";

export interface LanguageState {
  languages: Language[];
  loading: boolean;
  error: AxiosError | null;
}
