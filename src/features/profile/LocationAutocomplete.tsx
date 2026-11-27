import { Autocomplete, TextField } from "@mui/material";

import Spinner from "../../components/ui/Spinner";

interface LocationAutocompleteProps {
  label: string;
  options: string[];
  value: string | null;
  loading: boolean;
  disabled?: boolean;
  touched?: boolean;
  error?: string;
  onChange: (value: string | null) => void;
}

const LocationAutocomplete = ({
  label,
  options,
  value,
  loading,
  disabled,
  touched,
  error,
  onChange,
}: LocationAutocompleteProps) => (
  <Autocomplete<string>
    options={options}
    value={value}
    onChange={(_, newValue) => onChange(newValue)}
    loading={loading}
    disabled={disabled}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        fullWidth
        margin="normal"
        error={!!(touched && error)}
        helperText={touched ? error : null}
        slotProps={{
          input: {
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <Spinner /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          },
        }}
      />
    )}
  />
);

export default LocationAutocomplete;
