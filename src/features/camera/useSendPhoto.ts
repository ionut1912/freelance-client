import { useTransition, type RefObject } from "react";

import { sendPhoto } from "../../services/captureService";

import { canvasToSizedDataUrl, drawScaled, MAX_BASE64_CHARS } from "./capture";

/** Sends the current video frame to the desktop that opened the session. */
export function useSendPhoto(
  sessionId: string,
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const [sending, startSending] = useTransition();

  const captureAndSend = () => {
    if (!sessionId) {
      alert("Lipsește sessionId");
      return;
    }
    const video = videoRef.current,
      canvas = canvasRef.current;
    if (!video || !canvas) {
      return;
    }

    const ok = drawScaled(video, canvas);
    if (!ok) {
      alert("Camera nu e gata încă. Încearcă din nou.");
      return;
    }

    startSending(async () => {
      try {
        const { dataUrl, q } = canvasToSizedDataUrl(canvas);
        if (dataUrl.length > MAX_BASE64_CHARS) {
          alert(
            "Imaginea e prea mare pentru setările serverului. " +
              "Reduce calitatea/rezoluția sau mărește limita de mesaj pe server (SignalR).",
          );
          return;
        }

        await sendPhoto(sessionId, dataUrl);

        alert(`Foto trimisă (q=${q.toFixed(1)}). Revino pe desktop.`);
      } catch (e) {
        alert(`Eroare la trimitere: ${(e as Error).message}`);
      }
    });
  };

  return { sending, captureAndSend };
}
