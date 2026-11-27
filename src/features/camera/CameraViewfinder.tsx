import { Button } from "@mui/material";
import type { RefObject } from "react";

interface CameraViewfinderProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  streaming: boolean;
  onStart: () => void;
  onStop: () => void;
  onCapture: () => void;
}

const CameraViewfinder = ({
  videoRef,
  canvasRef,
  streaming,
  onStart,
  onStop,
  onCapture,
}: CameraViewfinderProps) => (
  <>
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="rounded-xl shadow-md max-w-full border border-gray-200"
      style={{ maxHeight: 360 }}
    />
    <canvas ref={canvasRef} style={{ display: "none" }} />

    <div className="flex gap-3 mt-4">
      {!streaming ? (
        <Button variant="contained" color="success" onClick={onStart}>
          Start Camera
        </Button>
      ) : (
        <>
          <Button variant="contained" color="primary" onClick={onCapture}>
            Capture
          </Button>
          <Button variant="outlined" color="error" onClick={onStop}>
            Stop
          </Button>
        </>
      )}
    </div>
  </>
);

export default CameraViewfinder;
