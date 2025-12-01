import type { AxiosError } from "axios";
import type { VerifyFaceResult } from "../../models/UserProfile";

export interface FaceVerificationState {
  verifyFaceResult: VerifyFaceResult | null;
  error: AxiosError | null;
  falseCount: number;
}
