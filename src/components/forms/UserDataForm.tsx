import * as React from "react";
import { Box, TextField, Button } from "@mui/material";
import { useForm } from "../../hooks/useForm";
import type { UserData } from "../../models/UserProfile";
import CameraCapture from "../camera/CameraCapture";
import { useEffect } from "react";
import { userDataValidationSchema } from "../../utils/schemaValidators";

interface UserDataFormProps {
  initialValues?: UserData;
  onSubmit: (values: UserData) => void;
}

const DEFAULT_USER: UserData = { bio: "", image: "" };

const UserDataForm = ({
  initialValues = DEFAULT_USER,
  onSubmit,
}: UserDataFormProps) => {
  const frozenInitials = React.useRef(initialValues).current;

  const formik = useForm<UserData>(
    frozenInitials,
    userDataValidationSchema,
    onSubmit,
    true,
  );

  useEffect(() => {
    if (formik.values.image) {
      void formik.validateField("image");
    }
  }, [formik, formik.values.image]);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Bio"
        name="bio"
        value={formik.values.bio}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!(formik.touched.bio && formik.errors.bio)}
        helperText={formik.touched.bio ? formik.errors.bio : null}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      <CameraCapture
        userData={formik.values}
        onChange={(field, value) => {
          const strValue = value ? String(value) : "";
          void formik.setFieldValue(field, strValue);
          void formik.setFieldTouched(field, true, false);
        }}
      />
      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button type="submit" variant="contained" disabled={!formik.isValid}>
          Save User Details
        </Button>
      </Box>
    </Box>
  );
};

export default UserDataForm;
