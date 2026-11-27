import { useEffect, useRef } from "react";

import {
  createPhotoConnection,
  joinSession,
} from "../../services/captureService";

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

    let mounted = true;
    const conn = createPhotoConnection(sessionId, (dataUrl) => {
      if (mounted) {
        onPhotoRef.current(dataUrl);
      }
    });
    conn.onreconnected(() => {
      void conn.invoke("Join", sessionId);
    });

    void (async () => {
      try {
        await joinSession(conn, sessionId);
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
