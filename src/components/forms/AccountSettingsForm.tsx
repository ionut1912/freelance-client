import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormGroup,
  Stack,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import CheckboxWithForm from "./common/CheckboxWithForm";
import { UserFormValues } from "../../models/Ui";
import GenericModal from "../wrappers/GenericModal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";
import { deleteCurrentUserAccount } from "../../store/auth/thunks";

interface Props {
  defaultValues?: UserFormValues;
}
export default function AccountSettingsForm({ defaultValues }: Props) {
  const leftColumnSx = { maxWidth: "200px", width: "100%" };
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      enableEmailNotifications: true,
      enableSmsNotifications: false,
      emailPublic: true,
      profilePublic: false,
    },
  });
  const [open, setOpen] = useState(false);
  const handleSave = useCallback((data: unknown) => {
    console.log(data);
  }, []);
  const handleYes = async () => {
    await dispatch(deleteCurrentUserAccount({ navigate }));
    setOpen(false);
  };

  const handleNo = () => setOpen(false);
  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <Card elevation={2} sx={{ padding: 2 }}>
        <CardContent>
          <Stack spacing={6}>
            <Stack direction={"row"} spacing={2}>
              <Stack spacing={2} paddingY={1} sx={leftColumnSx}>
                <Typography fontWeight={"fontWeightMedium"}>
                  Notifications
                </Typography>
              </Stack>
              <Stack spacing={2}>
                <FormGroup>
                  <CheckboxWithForm
                    control={control}
                    name={"enableEmailNotifications"}
                    label="Enable email notifications"
                  />
                  <CheckboxWithForm
                    control={control}
                    name={"enableSmsNotifications"}
                    label="Enable SMS notifications"
                  />
                </FormGroup>
              </Stack>
            </Stack>

            <Stack direction={"row"} spacing={2}>
              <Stack spacing={2} paddingY={1} sx={leftColumnSx}>
                <Typography fontWeight={"fontWeightMedium"}>Privacy</Typography>
              </Stack>
              <Stack spacing={2}>
                <FormGroup>
                  <CheckboxWithForm
                    control={control}
                    name={"emailPublic"}
                    label="Email address is public"
                  />
                  <CheckboxWithForm
                    control={control}
                    name={"profilePublic"}
                    label="Profile is public"
                  />
                </FormGroup>
              </Stack>
            </Stack>

            <Stack direction={"row"} spacing={2}>
              <Stack spacing={2} paddingY={1} sx={leftColumnSx}>
                <Typography fontWeight={"fontWeightMedium"}>
                  Description
                </Typography>
              </Stack>
              <Stack spacing={2}>
                <Typography variant={"body2"}>{defaultValues?.bio}</Typography>
              </Stack>
            </Stack>

            <Stack direction={"row"} spacing={2}>
              <Stack spacing={2} paddingY={1} sx={leftColumnSx}>
                <Typography fontWeight={"fontWeightMedium"}>
                  Delete account
                </Typography>
              </Stack>
              <Stack spacing={2}>
                <Button
                  variant={"contained"}
                  color={"error"}
                  onClick={() => setOpen(true)}
                >
                  Delete account
                </Button>
                <GenericModal
                  open={open}
                  handleClose={() => setOpen(false)}
                  text="Are you sure you want to delete your account?"
                  onYes={handleYes}
                  onNo={handleNo}
                />
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type={"submit"} variant={"contained"}>
            Save changes
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
