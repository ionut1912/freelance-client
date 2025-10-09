import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import {
  AccountGeneralFieldsNames,
  AccountGeneralForm,
  accountGeneralFormSchema,
} from "../../utils/schemaValidators";
import { UpdateUserRequest } from "../../models/Ui";
import GenericModal from "../wrappers/GenericModal";
import { AppDispatch, RootState } from "../../store";
import { patchImage, patchUserData } from "../../store/user-profile/thunks";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "../../hooks/useCurerentUser";

interface Props {
  submitButtonText?: string;
}

export default function UserForm({ submitButtonText = "Save changes" }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { freelancerProfile, clientProfile, loading } = useCurrentUser();
  const role = useSelector((state: RootState) => state.auth.role);
  const user = role === "Client" ? clientProfile : freelancerProfile;

  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<AccountGeneralForm>({
    resolver: yupResolver(accountGeneralFormSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      bio: "",
      image: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (user) {
      const values = {
        username: user.user?.username || "",
        email: user.user?.email || "",
        phone: user.user?.phoneNumber || "",
        bio: user.bio || "",
        image: user.image || "",
      };
      reset(values);
    }
  }, [user, reset]);

  const handleSave = useCallback(
    async (data: AccountGeneralForm) => {
      setSaving(true);
      try {
        const updateUser: UpdateUserRequest = {
          username: data.username,
          email: data.email,
          phoneNumber: data.phone,
          bio: data.bio!,
        };
        await dispatch(patchUserData(updateUser));
      } finally {
        setSaving(false);
      }
    },
    [dispatch],
  );

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
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
    await dispatch(patchImage(""));
    setOpen(false);
    reset({
      ...getValues(),
      image: "",
    });
  };

  const handleNo = () => setOpen(false);

  const userFormValues = getValues();

  if (loading)
    return <Typography textAlign="center">Loading user data...</Typography>;
  if (!user)
    return <Typography textAlign="center">No user profile found.</Typography>;

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <Grid
        component="div"
        sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
        }}
      >
        <Card sx={{ padding: 2, height: "100%" }} elevation={2}>
          <CardContent>
            <Stack
              direction="column"
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Avatar
                src={userFormValues.image}
                sx={{ width: 128, height: 128, border: "5px solid #DDD" }}
                alt={userFormValues.username}
              />
              <Typography textAlign="center" variant="subtitle2">
                {userFormValues.username}
              </Typography>
              <Typography
                textAlign="center"
                fontSize={12}
                color="text.secondary"
              >
                Allowed *.jpeg, *.jpg, *.png <br />
                max size of 5.0 MB
              </Typography>
              <input
                type="file"
                accept="image/jpeg, image/jpg, image/png"
                id="upload-input"
                style={{ display: "none" }}
                onChange={handleUpload}
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
              <Button color="error" size="small" onClick={() => setOpen(true)}>
                Remove picture
              </Button>
              <GenericModal
                open={open}
                handleClose={() => setOpen(false)}
                text="Are you sure you want to delete your image?"
                onYes={handleYes}
                onNo={handleNo}
              />
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ padding: 2, flex: 1, height: "100%" }} elevation={2}>
          <CardHeader title="Account" subheader="Basic account information" />
          <CardContent>
            <Stack spacing={6}>
              <Stack direction="row" spacing={4}>
                <FormControl fullWidth>
                  <TextField
                    label="Username"
                    size="medium"
                    {...register(AccountGeneralFieldsNames.username)}
                    error={!!errors[AccountGeneralFieldsNames.username]}
                  />
                  {errors[AccountGeneralFieldsNames.username] && (
                    <FormHelperText error>
                      {errors[AccountGeneralFieldsNames.username]?.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    label="Email"
                    size="medium"
                    {...register(AccountGeneralFieldsNames.email)}
                    error={!!errors[AccountGeneralFieldsNames.email]}
                  />
                  {errors[AccountGeneralFieldsNames.email] && (
                    <FormHelperText error>
                      {errors[AccountGeneralFieldsNames.email]?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
              <Stack direction="row" spacing={4}>
                <FormControl fullWidth>
                  <TextField
                    label="Phone Number"
                    size="medium"
                    {...register(AccountGeneralFieldsNames.phone)}
                    error={!!errors[AccountGeneralFieldsNames.phone]}
                  />
                  {errors[AccountGeneralFieldsNames.phone] && (
                    <FormHelperText error>
                      {errors[AccountGeneralFieldsNames.phone]?.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    label="Bio"
                    size="medium"
                    {...register(AccountGeneralFieldsNames.bio)}
                    error={!!errors[AccountGeneralFieldsNames.bio]}
                  />
                  {errors[AccountGeneralFieldsNames.bio] && (
                    <FormHelperText error>
                      {errors[AccountGeneralFieldsNames.bio]?.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end", padding: 2 }}>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Saving..." : submitButtonText}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </form>
  );
}
