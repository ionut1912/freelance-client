import { useState, type RefObject } from "react";

import { createHubConnection } from "../../lib/signalr";
import { API_URL as API_BASE } from "../../services/utils";

import { canvasToSizedDataUrl, drawScaled, MAX_BASE64_CHARS } from "./capture";

/** Sends the current video frame to the desktop that opened the session. */
export function useSendPhoto(
  sessionId: string,
  videoRef: RefObject<HTMLVideoElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
) {
  const [sending, setSending] = useState(false);

  const captureAndSend = async () => {
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

    setSending(true);
    try {
      const { dataUrl, q } = canvasToSizedDataUrl(canvas);
      if (dataUrl.length > MAX_BASE64_CHARS) {
        setSending(false);
        alert(
          "Imaginea e prea mare pentru setările serverului. " +
            "Reduce calitatea/rezoluția sau mărește limita de mesaj pe server (SignalR).",
        );
        return;
      }

      const conn = createHubConnection(API_BASE);
      try {
        await conn.start();
        await conn.invoke("Join", sessionId);
        await conn.invoke("SendPhotoDataUrl", sessionId, dataUrl);
      } finally {
        await conn.stop();
      }

      alert(`Foto trimisă (q=${q.toFixed(1)}). Revino pe desktop.`);
    } catch (e) {
      alert(`Eroare la trimitere: ${(e as Error).message}`);
    } finally {
      setSending(false);
    }
  };

  return { sending, captureAndSend };
}
