import { TextField } from "@mui/material";
import type { FormikProps } from "formik";

import type { AddressData } from "../../models/UserProfile";

interface FormikTextFieldProps {
  formik: FormikProps<AddressData>;
  name: keyof AddressData;
  label: string;
}

const FormikTextField = ({ formik, name, label }: FormikTextFieldProps) => (
  <TextField
    label={label}
    name={name}
    value={formik.values[name]}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={!!(formik.touched[name] && formik.errors[name])}
    helperText={formik.touched[name] ? formik.errors[name] : null}
    fullWidth
    margin="normal"
  />
);

export default FormikTextField;
