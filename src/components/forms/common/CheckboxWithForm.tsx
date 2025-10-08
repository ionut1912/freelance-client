import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

export default function CheckboxWithForm({
  control,
  name,
  label,
}: {
  control: any;
  name: string;
  label: string;
}) {
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
              checked={value}
              inputRef={ref}
            />
          }
          label={label}
        />
      )}
    />
  );
}
