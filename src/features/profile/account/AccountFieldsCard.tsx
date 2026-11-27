import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
} from "@mui/material";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import FormField from "../../../components/ui/FormField";
import {
  AccountGeneralFieldsNames,
  type AccountGeneralForm,
} from "../../../utils/schemaValidators";

interface AccountFieldsCardProps {
  register: UseFormRegister<AccountGeneralForm>;
  errors: FieldErrors<AccountGeneralForm>;
  saving: boolean;
  submitButtonText: string;
}

const AccountFieldsCard = ({
  register,
  errors,
  saving,
  submitButtonText,
}: AccountFieldsCardProps) => (
  <Card sx={{ padding: 2, flex: 1, height: "100%" }} elevation={2}>
    <CardHeader title="Account" subheader="Basic account information" />
    <CardContent>
      <Stack spacing={6}>
        <Stack direction="row" spacing={4}>
          <FormField
            label="Username"
            registration={register(AccountGeneralFieldsNames.username)}
            error={errors.username}
          />
          <FormField
            label="Email"
            registration={register(AccountGeneralFieldsNames.email)}
            error={errors.email}
          />
        </Stack>
        <Stack direction="row" spacing={4}>
          <FormField
            label="Phone Number"
            registration={register(AccountGeneralFieldsNames.phone)}
            error={errors.phone}
          />
          <FormField
            label="Bio"
            registration={register(AccountGeneralFieldsNames.bio)}
            error={errors.bio}
          />
        </Stack>
      </Stack>
    </CardContent>
    <CardActions sx={{ justifyContent: "flex-end", padding: 2 }}>
      <Button type="submit" variant="contained" disabled={saving}>
        {saving ? "Saving..." : submitButtonText}
      </Button>
    </CardActions>
  </Card>
);

export default AccountFieldsCard;
