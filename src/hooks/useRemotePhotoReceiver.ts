import { useEffect, useRef } from "react";

import { createHubConnection, onRemotePhoto } from "../lib/signalr";
import { API_URL as API_BASE } from "../services/utils";

export function useRemotePhotoReceiver(
  sessionId: string,
  onPhoto: (dataUrl: string) => void,
) {
  // The latest callback, without reconnecting when it changes.
  const onPhotoRef = useRef(onPhoto);
  useEffect(() => {
    onPhotoRef.current = onPhoto;
  }, [onPhoto]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    const conn = createHubConnection(API_BASE);
    let mounted = true;

    onRemotePhoto(conn, sessionId, (dataUrl) => {
      if (mounted) {
        onPhotoRef.current(dataUrl);
      }
    });
    conn.onreconnected(() => {
      void conn.invoke("Join", sessionId);
    });

    void (async () => {
      try {
        await conn.start();
        await conn.invoke("Join", sessionId);
      } catch (e) {
        console.error("SignalR connect error:", e);
      }
    })();

    return () => {
      mounted = false;
      void conn.stop();
    };
  }, [sessionId]);
}
