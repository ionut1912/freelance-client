import { Button, Typography } from "@mui/material";

import type { PhotoSource } from "./useVerificationPhoto";

interface PhotoPreviewProps {
  src: string;
  source: PhotoSource;
  onRetake: () => void;
  onVerify: () => void;
}

const PhotoPreview = ({
  src,
  source,
  onRetake,
  onVerify,
}: PhotoPreviewProps) => (
  <div className="w-full mt-6 flex flex-col items-center">
    <Typography
      variant="subtitle1"
      className="font-semibold text-gray-700 mb-2"
    >
      Preview {source ? `(${source})` : ""}
    </Typography>
    <img
      src={src}
      alt="Captured"
      className="rounded-xl shadow-md mb-4 max-w-sm border border-gray-200"
      style={{ objectFit: "cover", maxHeight: 360 }}
    />
    <div className="flex gap-3">
      <Button variant="outlined" onClick={onRetake}>
        Retake
      </Button>
      <Button variant="contained" color="secondary" onClick={onVerify}>
        Verify Photo
      </Button>
    </div>
  </div>
);

export default PhotoPreview;
