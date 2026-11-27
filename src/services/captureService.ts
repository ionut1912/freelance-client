import type { HubConnection } from "@microsoft/signalr";

import { createHubConnection, onRemotePhoto } from "../lib/signalr";

import { API_URL } from "./utils";

export interface CaptureSession {
  sessionId: string;
  deepLink: string;
}

export async function createCaptureSession(): Promise<CaptureSession> {
  const res = await fetch(`${API_URL}/capture/sessions`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Capture session failed: ${res.status}`);
  }
  return (await res.json()) as CaptureSession;
}

/** A connection, not yet started, that reports the session's photos. */
export function createPhotoConnection(
  sessionId: string,
  onPhoto: (dataUrl: string) => void,
) {
  const conn = createHubConnection(API_URL);
  onRemotePhoto(conn, sessionId, onPhoto);
  return conn;
}

export async function joinSession(conn: HubConnection, sessionId: string) {
  await conn.start();
  await conn.invoke("Join", sessionId);
}

/** Connects just long enough to deliver one photo. */
export async function sendPhoto(sessionId: string, dataUrl: string) {
  const conn = createHubConnection(API_URL);
  try {
    await joinSession(conn, sessionId);
    await conn.invoke("SendPhotoDataUrl", sessionId, dataUrl);
  } finally {
    await conn.stop();
  }
}
