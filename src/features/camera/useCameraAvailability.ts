import { useEffect, useState } from "react";

export function useCameraAvailability() {
  const [checking, setChecking] = useState(true);
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    const request = { cancelled: false };
    void (async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter((d) => d.kind === "videoinput");
        if (!request.cancelled) {
          setHasCamera(cams.length > 0);
        }
      } catch {
        if (!request.cancelled) {
          setHasCamera(false);
        }
      } finally {
        if (!request.cancelled) {
          setChecking(false);
        }
      }
    })();
    return () => {
      request.cancelled = true;
    };
  }, []);

  return { checking, hasCamera };
}
