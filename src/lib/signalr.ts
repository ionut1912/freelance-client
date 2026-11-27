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
