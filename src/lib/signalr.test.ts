import * as signalR from "@microsoft/signalr";
import { createHubConnection } from "../lib/signalr";

jest.mock("@microsoft/signalr", () => {
  const builder = {
    withUrl: jest.fn().mockReturnThis(),
    withAutomaticReconnect: jest.fn().mockReturnThis(),
    build: jest.fn(() => "connection"),
  };
  return {
    HubConnectionBuilder: jest.fn(() => builder),
    HttpTransportType: { WebSockets: 1 },
  };
});

it.each([
  ["https://api.test/api", "https://api.test"],
  ["https://api.test", "https://api.test"],
  ["", ""],
])("connects to the hub for '%s'", (apiBase, origin) => {
  expect(createHubConnection(apiBase)).toBe("connection");
  const builder = new signalR.HubConnectionBuilder();
  expect(jest.mocked(builder.withUrl)).toHaveBeenCalledWith(
    `${origin}/hubs/capture`,
    expect.objectContaining({ withCredentials: true, skipNegotiation: true }),
  );
});
