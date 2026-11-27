import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import type {
  ClientProfileDto,
  FreelancerProfileDto,
} from "../../models/UserProfile";
import type { AppDispatch } from "../../store";
import { verifyCapturedFace } from "../../store/face-verification/thunks";

import CameraViewfinder from "./CameraViewfinder";
import PhotoPreview from "./PhotoPreview";
import RemoteCaptureFallback from "./RemoteCaptureFallback";
import { useCamera } from "./useCamera";
import { useCameraAvailability } from "./useCameraAvailability";
import { useVerificationPhoto } from "./useVerificationPhoto";

interface VerifyPhotoProps {
  profile: ClientProfileDto | FreelancerProfileDto;
}

const VerifyPhoto = ({ profile }: VerifyPhotoProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    videoRef,
    canvasRef,
    streaming,
    startCamera,
    stopCamera,
    capturePhoto,
  } = useCamera();
  const { checking, hasCamera } = useCameraAvailability();

  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const sessionId = params.get("session") ?? "";

  const { photo, source, snackOpen, accept, acceptRemote, clear, closeSnack } =
    useVerificationPhoto(sessionId);

  const handleCapture = () => {
    const captured = capturePhoto();
    if (captured) {
      accept(captured, "local");
    }
  };

  useEffect(() => {
    if (photo && streaming) {
      stopCamera();
    }
  }, [photo, streaming, stopCamera]);

  const handleVerify = () => {
    if (!photo) {
      return;
    }
    void dispatch(
      verifyCapturedFace({
        faceVerificationRequest: { faceBase64Image: photo },
        profile,
        navigate,
      }),
    );
  };

  const handleRetake = () => {
    clear();
    if (hasCamera && !streaming) {
      void startCamera();
    }
  };

  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <Card className="w-full max-w-lg shadow-xl rounded-2xl">
        <CardContent className="flex flex-col items-center gap-4">
          <Typography variant="h5" className="font-bold text-gray-700">
            Camera Verification
          </Typography>

          {hasCamera ? (
            <CameraViewfinder
              videoRef={videoRef}
              canvasRef={canvasRef}
              streaming={streaming}
              onStart={startCamera}
              onStop={stopCamera}
              onCapture={handleCapture}
            />
          ) : (
            <div className="w-full mt-2">
              <Typography
                variant="subtitle1"
                className="text-gray-600 mb-2 text-center"
              >
                No local camera detected. You can capture a photo from another
                device:
              </Typography>
              <RemoteCaptureFallback onPhoto={acceptRemote} />
            </div>
          )}

          {photo ? (
            <PhotoPreview
              src={photo}
              source={source}
              onRetake={handleRetake}
              onVerify={handleVerify}
            />
          ) : null}
        </CardContent>
      </Card>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={closeSnack}
        message={
          source === "remote" ? "Photo received from mobile" : "Photo captured"
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
};

export default VerifyPhoto;
