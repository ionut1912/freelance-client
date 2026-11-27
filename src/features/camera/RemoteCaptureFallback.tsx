import type { HubConnection } from "@microsoft/signalr";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import QrCodeSvg from "react-qr-code";

import {
  createCaptureSession,
  createPhotoConnection,
  joinSession,
  type CaptureSession,
} from "../../services/captureService";

const RemoteCaptureFallback = ({
  onPhoto,
}: {
  onPhoto: (dataUrl: string) => void;
}) => {
  const [session, setSession] = useState<CaptureSession | null>(null);

  // The latest callback, without restarting the session when it changes.
  const onPhotoRef = useRef(onPhoto);
  useEffect(() => {
    onPhotoRef.current = onPhoto;
  }, [onPhoto]);

  useEffect(() => {
    let conn: HubConnection | null = null;
    const request = { cancelled: false };

    void (async () => {
      try {
        const data = await createCaptureSession();
        if (request.cancelled) {
          return;
        }
        setSession(data);

        conn = createPhotoConnection(data.sessionId, (dataUrl) =>
          onPhotoRef.current(dataUrl),
        );
        await joinSession(conn, data.sessionId);
      } catch (err) {
        console.error("SignalR start error:", err);
      }
    })();

    return () => {
      request.cancelled = true;
      void conn?.stop().catch(() => undefined);
    };
  }, []);

  if (!session) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography variant="h6" align="center">
        Nu am detectat cameră. Scanează cu telefonul:
      </Typography>
      <Box bgcolor="#fff" p={2} borderRadius={2}>
        <QrCodeSvg value={session.deepLink} size={180} />
      </Box>
      <Stack direction="row" spacing={1} sx={{ width: "100%", maxWidth: 520 }}>
        <TextField
          value={session.deepLink}
          fullWidth
          size="small"
          slotProps={{ input: { readOnly: true } }}
        />
        <Button onClick={() => navigator.clipboard.writeText(session.deepLink)}>
          Copiază
        </Button>
      </Stack>
      <Typography variant="body2" color="text.secondary">
        Deschide linkul pe telefon, capturează și fotografia va apărea aici.
      </Typography>
    </Box>
  );
};

export default RemoteCaptureFallback;
