import type { VerifyFaceResult } from "../../models/UserProfile";

export interface FaceVerificationState {
  verifyFaceResult: VerifyFaceResult | null;
  error: string | null;
  falseCount: number;
}
