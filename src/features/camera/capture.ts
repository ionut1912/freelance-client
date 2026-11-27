/** Capture helpers for the phone page: pick a camera, shrink the frame. */
export const MAX_BASE64_CHARS = 40_000;
const TARGET_W = 640;
const INITIAL_QUALITY = 0.6;

export async function getFrontCameraStream(): Promise<MediaStream> {
  try {
    return await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { exact: "user" },
        width: { ideal: TARGET_W },
        height: { ideal: 480 },
      },
      audio: false,
    });
  } catch {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter((d) => d.kind === "videoinput");
    const front =
      videoInputs.find((d) => /front|facetime|user/i.test(d.label || "")) ??
      videoInputs.at(0);

    if (!front) {
      throw new Error("Nu am găsit cameră video pe acest device.");
    }

    return await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: front.deviceId } },
      audio: false,
    });
  }
}

export const drawScaled = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) => {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  if (!vw || !vh) {
    return false;
  }
  const scale = Math.min(TARGET_W / Math.max(vw, vh), 1);
  const cw = Math.round(vw * scale);
  const ch = Math.round(vh * scale);

  canvas.width = cw;
  canvas.height = ch;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return false;
  }
  ctx.drawImage(video, 0, 0, cw, ch);
  return true;
};

export const canvasToSizedDataUrl = (
  canvas: HTMLCanvasElement,
  maxChars = MAX_BASE64_CHARS,
) => {
  let q = INITIAL_QUALITY;
  let dataUrl = canvas.toDataURL("image/jpeg", q);
  while (dataUrl.length > maxChars && q > 0.3) {
    q -= 0.1;
    dataUrl = canvas.toDataURL("image/jpeg", q);
  }
  return { dataUrl, q };
};
