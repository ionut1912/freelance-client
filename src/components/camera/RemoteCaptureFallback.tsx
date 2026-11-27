import type { HubConnection } from "@microsoft/signalr";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

import { createHubConnection, onRemotePhoto } from "../../lib/signalr";
import { API_URL as API_BASE } from "../../services/utils";

interface SessionData {
  sessionId: string;
  deepLink: string;
}

const RemoteCaptureFallback = ({
  onPhoto,
}: {
  onPhoto: (dataUrl: string) => void;
}) => {
  const [session, setSession] = useState<SessionData | null>(null);

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
        const res = await fetch(`${API_BASE}/capture/sessions`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Capture session failed: ${res.status}`);
        }
        const data = (await res.json()) as SessionData;
        if (request.cancelled) {
          return;
        }
        setSession(data);

        conn = createHubConnection(API_BASE);
        onRemotePhoto(conn, data.sessionId, (dataUrl) =>
          onPhotoRef.current(dataUrl),
        );
        await conn.start();
        await conn.invoke("Join", data.sessionId);
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
        <QRCode value={session.deepLink} size={180} />
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
