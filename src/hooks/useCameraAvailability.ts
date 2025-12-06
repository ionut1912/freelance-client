import { useEffect, useState } from "react";

export function useCameraAvailability() {
  const [checking, setChecking] = useState(true);
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter((d) => d.kind === "videoinput");
        setHasCamera(cams.length > 0);
      } catch {
        setHasCamera(false);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  return { checking, hasCamera };
}
