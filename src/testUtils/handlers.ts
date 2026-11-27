import { http, HttpResponse, type JsonBodyType } from "msw";
import { server } from "./server";

export const API = "https://localhost:7020/api";

type Method = "get" | "post" | "patch" | "delete";

/** Paths starting with "http" are third-party; the rest are our backend. */
const url = (path: string) =>
  path.startsWith("http") ? path : `${API}/${path}`;

export const reply = (
  method: Method,
  path: string,
  body: JsonBodyType = {},
  status = 200,
) =>
  server.use(
    http[method](url(path), () => HttpResponse.json(body, { status })),
  );

export const offline = (method: Method, path: string) =>
  server.use(http[method](url(path), () => HttpResponse.error()));

export const malformed = (method: Method, path: string) =>
  server.use(
    http[method](url(path), () =>
      HttpResponse.text("{not json", {
        headers: { "content-type": "application/json" },
      }),
    ),
  );

/** Answers only after the returned function is called: a slow response. */
export const held = (method: Method, path: string, body: JsonBodyType = {}) => {
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  server.use(
    http[method](url(path), async () => {
      await gate;
      return HttpResponse.json(body);
    }),
  );
  return () => release();
};

export interface SentRequest {
  method: string;
  path: string;
  url: string;
  authorization: string | null;
  body: () => Promise<unknown>;
}

/** Every request the app makes from now on, in order. */
export const recordRequests = () => {
  const sent: SentRequest[] = [];
  server.events.on("request:start", ({ request }) => {
    const text = request.clone().text();
    sent.push({
      method: request.method,
      url: request.url,
      path: request.url.replace(`${API}/`, ""),
      authorization: request.headers.get("authorization"),
      body: async () => {
        const raw = await text;
        return raw ? (JSON.parse(raw) as unknown) : undefined;
      },
    });
  });
  return sent;
};
