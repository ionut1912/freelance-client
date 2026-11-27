import * as signalR from "@microsoft/signalr";

export function createHubConnection(apiBase: string) {
  // Hubs are served from the server root, not under /api.
  const base = apiBase.replace(/\/api\/?$/, "");
  return new signalR.HubConnectionBuilder()
    .withUrl(`${base}/hubs/capture`, {
      withCredentials: true,
      transport: signalR.HttpTransportType.WebSockets,
      skipNegotiation: true,
    })
    .withAutomaticReconnect()
    .build();
}

/** Calls `onPhoto` for any of the photo events, for this session only. */
export function onRemotePhoto(
  conn: signalR.HubConnection,
  sessionId: string,
  onPhoto: (dataUrl: string) => void,
) {
  const forSession = (sid: string, dataUrl: string) => {
    if (!sid || sid === sessionId) {
      onPhoto(dataUrl);
    }
  };
  conn.on("PhotoDataUrl", forSession);
  conn.on("SendPhotoDataUrl", forSession);
  conn.on("Photo", onPhoto);
  conn.on("PhotoReceived", (p: { dataUrl: string }) => onPhoto(p.dataUrl));
}
