import { useEffect, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import type { HubConnection } from "@microsoft/signalr";
import QRCode from "react-qr-code";
import { createHubConnection } from "../../lib/signalr";

const API_BASE = process.env.REACT_APP_API_BASE ?? "";

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

  useEffect(() => {
    let conn: HubConnection | null = null;

    void (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/capture/sessions`, {
          method: "POST",
          credentials: "include",
        });
        const data = (await res.json()) as SessionData;
        setSession(data);

        conn = createHubConnection(API_BASE);
        await conn.start();
        await conn.invoke("Join", data.sessionId);
        conn.on("PhotoReceived", (p: { dataUrl: string }) =>
          onPhoto(p.dataUrl),
        );
      } catch (err) {
        console.error("SignalR start error:", err);
      }
    })();

    return () => {
      void conn?.stop().catch(() => {});
    };
  }, [onPhoto]);

  if (!session) return null;

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
          InputProps={{ readOnly: true }}
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
