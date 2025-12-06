import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

interface CheckboxWithFormProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

const CheckboxWithForm = <T extends FieldValues>({
  control,
  name,
  label,
}: CheckboxWithFormProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <FormControlLabel
          control={
            <Checkbox
              onBlur={onBlur}
              onChange={onChange}
              checked={value as boolean}
              inputRef={ref}
            />
          }
          label={label}
        />
      )}
    />
  );
};

export default CheckboxWithForm;
