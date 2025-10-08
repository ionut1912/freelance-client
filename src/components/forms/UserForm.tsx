import React, { useCallback } from "react";
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
import { UserFormValues } from "../../models/Ui";

interface Props {
  defaultValues?: UserFormValues;
  submitButtonText?: string;
}

export default function UserForm({
  defaultValues,
  submitButtonText = "Save changes",
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<AccountGeneralForm>({
    resolver: yupResolver(accountGeneralFormSchema),
    defaultValues,
  });

  const userFormValues = getValues();

  const handleSave = useCallback((data: AccountGeneralForm) => {
    console.log(data);
  }, []);

  return (
    <form onSubmit={handleSubmit(handleSave)}>
      <Grid
        component="div"
        sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" }, // responsive columns
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
              <Stack justifyContent="center">
                <Typography textAlign="center" variant="subtitle2">
                  {userFormValues.username}
                </Typography>
              </Stack>
              <Typography
                textAlign="center"
                fontSize={12}
                color="text.secondary"
              >
                Allowed *.jpeg, *.jpg, *.png, *.gif <br />
                max size of 5.0 MB
              </Typography>
              <Button size="small" variant="contained">
                Upload new
              </Button>
              <Button color="error" size="small">
                Remove picture
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Account form card */}
        <Card sx={{ padding: 2, flex: 1, height: "100%" }} elevation={2}>
          <CardHeader title="Account" subheader="Basic account information" />
          <CardContent>
            <Stack spacing={4}>
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
            </Stack>
          </CardContent>

          <CardActions sx={{ justifyContent: "flex-end", padding: 2 }}>
            <Button type="submit" variant="contained">
              {submitButtonText}
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </form>
  );
}
