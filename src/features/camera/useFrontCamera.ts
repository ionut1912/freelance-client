import { useEffect, useRef, useState } from "react";

import { getFrontCameraStream } from "./capture";

/** Streams the front camera into `videoRef` for as long as it is mounted. */
export function useFrontCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    const request = { cancelled: false };
    void (async () => {
      try {
        const stream = await getFrontCameraStream();
        if (videoElement && !request.cancelled) {
          videoElement.srcObject = stream;
          setReady(true);
        } else {
          stream.getTracks().forEach((t) => t.stop());
        }
      } catch (e) {
        alert((e as Error).message);
      }
    })();
    return () => {
      request.cancelled = true;
      const s = videoElement?.srcObject as MediaStream | null;
      s?.getTracks().forEach((t) => t.stop());
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
  }, []);

  return { videoRef, ready };
}
