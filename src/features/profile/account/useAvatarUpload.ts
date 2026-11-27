import { useState, type ChangeEvent } from "react";
import type { UseFormGetValues, UseFormReset } from "react-hook-form";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../../../store";
import { patchImage } from "../../../store/user-profile/thunks";
import type { AccountGeneralForm } from "../../../utils/schemaValidators";

const convertToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () =>
      reject(reader.error ?? new Error("Could not read the file"));
  });

/** Uploading and removing the profile picture. */
export function useAvatarUpload(
  getValues: UseFormGetValues<AccountGeneralForm>,
  reset: UseFormReset<AccountGeneralForm>,
) {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, JPEG, and PNG files are allowed.");
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size must be less than 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const base64Image = await convertToBase64(file);
      const resultAction = await dispatch(patchImage(base64Image));
      if (patchImage.fulfilled.match(resultAction)) {
        reset({
          ...getValues(),
          image: base64Image,
        });
      }
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleYes = async () => {
    const result = await dispatch(patchImage(""));
    setOpen(false);
    if (patchImage.fulfilled.match(result)) {
      reset({
        ...getValues(),
        image: "",
      });
    }
  };

  const handleNo = () => setOpen(false);

  return {
    uploading,
    confirmOpen: open,
    askRemove: () => setOpen(true),
    cancelRemove: handleNo,
    confirmRemove: handleYes,
    handleUpload,
  };
}
