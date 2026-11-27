import { toast } from "react-toastify";

import { extractErrorMessages } from "./httpError";

/** Shows every message an API error carries. */
export function toastErrors(error: unknown) {
  extractErrorMessages(error).forEach((m) => toast.error(m));
}
