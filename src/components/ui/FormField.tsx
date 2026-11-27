import { FormControl, FormHelperText, TextField } from "@mui/material";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  label: string;
  /** The result of react-hook-form's `register` for this field. */
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

const FormField = ({ label, registration, error }: FormFieldProps) => (
  <FormControl fullWidth>
    <TextField label={label} size="medium" {...registration} error={!!error} />
    {error ? (
      <FormHelperText error>
        {typeof error === "object" && "message" in error
          ? error.message
          : "Invalid field"}
      </FormHelperText>
    ) : null}
  </FormControl>
);

export default FormField;
