import { Box, Button, Typography } from "@mui/material";
import { useRef } from "react";

import { useFrontCamera } from "./useFrontCamera";
import { useSendPhoto } from "./useSendPhoto";

const MobileCapturePage = () => {
  const { videoRef, ready } = useFrontCamera();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session") ?? "";
  const { sending, captureAndSend } = useSendPhoto(
    sessionId,
    videoRef,
    canvasRef,
  );

  return (
    <Box p={2} display="flex" flexDirection="column" gap={2}>
      <Typography variant="h5">Captură foto (telefon)</Typography>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: "100%", borderRadius: 8 }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <Button
        variant="contained"
        disabled={!ready || sending}
        onClick={captureAndSend}
      >
        {sending ? "Se trimite…" : "Capture & Trimite"}
      </Button>
    </Box>
  );
};

export default MobileCapturePage;
