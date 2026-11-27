import { Typography, Grid } from "@mui/material";

import { useCurrentProfile } from "../../../hooks/useCurrentProfile";

import AccountFieldsCard from "./AccountFieldsCard";
import AvatarCard from "./AvatarCard";
import { useAccountForm } from "./useAccountForm";
import { useAvatarUpload } from "./useAvatarUpload";

interface Props {
  submitButtonText?: string;
}

const UserForm = ({ submitButtonText = "Save changes" }: Props) => {
  const { profile: user, loading } = useCurrentProfile();

  const { register, errors, getValues, reset, saving, onSubmit } =
    useAccountForm(user);
  const avatar = useAvatarUpload(getValues, reset);

  const userFormValues = getValues();

  if (loading) {
    return <Typography textAlign="center">Loading user data...</Typography>;
  }
  if (!user) {
    return <Typography textAlign="center">No user profile found.</Typography>;
  }

  return (
    <form onSubmit={onSubmit}>
      <Grid
        component="div"
        sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
        }}
      >
        <AvatarCard
          image={userFormValues.image}
          username={userFormValues.username}
          uploading={avatar.uploading}
          confirmOpen={avatar.confirmOpen}
          onUpload={avatar.handleUpload}
          onAskRemove={avatar.askRemove}
          onCancelRemove={avatar.cancelRemove}
          onConfirmRemove={avatar.confirmRemove}
        />
        <AccountFieldsCard
          register={register}
          errors={errors}
          saving={saving}
          submitButtonText={submitButtonText}
        />
      </Grid>
    </form>
  );
};

export default UserForm;
