import { useCallback, useState } from "react";

import { useRemotePhotoReceiver } from "./useRemotePhotoReceiver";

export type PhotoSource = "local" | "remote" | null;

/** The photo waiting to be verified, whichever device it came from. */
export function useVerificationPhoto(sessionId: string) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [source, setSource] = useState<PhotoSource>(null);
  const [snackOpen, setSnackOpen] = useState(false);

  const accept = useCallback((dataUrl: string, from: PhotoSource) => {
    setPhoto(dataUrl);
    setSource(from);
    setSnackOpen(true);
  }, []);

  const acceptRemote = useCallback(
    (dataUrl: string) => {
      if (typeof dataUrl === "string" && dataUrl.startsWith("data:image")) {
        accept(dataUrl, "remote");
      }
    },
    [accept],
  );

  useRemotePhotoReceiver(sessionId, acceptRemote);

  const clear = () => {
    setPhoto(null);
    setSource(null);
  };
  const closeSnack = () => setSnackOpen(false);

  return { photo, source, snackOpen, accept, acceptRemote, clear, closeSnack };
}
