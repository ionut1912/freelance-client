import {
  Avatar,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import type { ChangeEvent } from "react";

import GenericModal from "../../../components/ui/ConfirmModal";

interface AvatarCardProps {
  image?: string;
  username: string;
  uploading: boolean;
  confirmOpen: boolean;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onAskRemove: () => void;
  onCancelRemove: () => void;
  onConfirmRemove: () => void;
}

const AvatarCard = ({
  image,
  username,
  uploading,
  confirmOpen,
  onUpload,
  onAskRemove,
  onCancelRemove,
  onConfirmRemove,
}: AvatarCardProps) => (
  <Card sx={{ padding: 2, height: "100%" }} elevation={2}>
    <CardContent>
      <Stack
        direction="column"
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Avatar
          src={image}
          sx={{ width: 128, height: 128, border: "5px solid #DDD" }}
          alt={username}
        />
        <Typography textAlign="center" variant="subtitle2">
          {username}
        </Typography>
        <Typography textAlign="center" fontSize={12} color="text.secondary">
          Allowed *.jpeg, *.jpg, *.png <br />
          max size of 5.0 MB
        </Typography>
        <input
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          id="upload-input"
          style={{ display: "none" }}
          onChange={onUpload}
        />
        <Button
          size="small"
          variant="contained"
          component="label"
          htmlFor="upload-input"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload new"}
        </Button>
        <Button color="error" size="small" onClick={onAskRemove}>
          Remove picture
        </Button>
        <GenericModal
          open={confirmOpen}
          handleClose={onCancelRemove}
          text="Are you sure you want to delete your image?"
          onYes={onConfirmRemove}
          onNo={onCancelRemove}
        />
      </Stack>
    </CardContent>
  </Card>
);

export default AvatarCard;
