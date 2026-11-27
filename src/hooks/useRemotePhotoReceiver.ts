import { useEffect } from "react";
import { createHubConnection } from "../lib/signalr";

import { API_URL as API_BASE } from "../services/utils";

export function useRemotePhotoReceiver(
  sessionId: string,
  onPhoto: (dataUrl: string) => void,
) {
  useEffect(() => {
    if (!sessionId) return;

    const conn = createHubConnection(API_BASE);
    let mounted = true;

    void (async () => {
      try {
        await conn.start();
        await conn.invoke("Join", sessionId);
        conn.on("PhotoDataUrl", (sid: string, dataUrl: string) => {
          if (!mounted) return;
          if (!sid || sid === sessionId) onPhoto(dataUrl);
        });
        conn.on("SendPhotoDataUrl", (sid: string, dataUrl: string) => {
          if (!mounted) return;
          if (!sid || sid === sessionId) onPhoto(dataUrl);
        });
        conn.on("Photo", (dataUrl: string) => {
          if (!mounted) return;
          onPhoto(dataUrl);
        });
        conn.onreconnected(() => {
          void conn.invoke("Join", sessionId);
        });
      } catch (e) {
        console.error("SignalR connect error:", e);
      }
    })();

    return () => {
      mounted = false;
      void conn.stop();
    };
  }, [sessionId, onPhoto]);
}
