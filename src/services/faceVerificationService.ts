import type { AxiosResponse } from "axios";
import type {
  FaceVerificationRequest,
  VerifyFaceResult,
} from "../models/UserProfile";
import { api, API_URL } from "./utils";

export default function verifyFace(
  faceVerificationRequest: FaceVerificationRequest,
): Promise<AxiosResponse<VerifyFaceResult>> {
  return api.post<VerifyFaceResult>(
    `${API_URL}/verifyFace`,
    faceVerificationRequest,
    { headers: { "requires-auth": "" } },
  );
}
