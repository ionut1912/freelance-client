import { Autocomplete, TextField, type AutocompleteProps } from "@mui/material";

import Spinner from "../../../components/ui/Spinner";

type FilterOptions = AutocompleteProps<
  string,
  true,
  false,
  boolean
>["filterOptions"];

interface MultiSelectFieldProps {
  label: string;
  options: string[];
  value: string[];
  loading: boolean;
  loadingText: string;
  freeSolo?: boolean;
  filterOptions?: FilterOptions;
  touched: boolean;
  error?: string | string[];
  onChange: (value: string[]) => void;
}

const MultiSelectField = ({
  label,
  options,
  value,
  loading,
  loadingText,
  freeSolo = false,
  filterOptions,
  touched,
  error,
  onChange,
}: MultiSelectFieldProps) => (
  <Autocomplete<string, true, false, boolean>
    multiple
    freeSolo={freeSolo}
    disableCloseOnSelect
    filterSelectedOptions
    options={options}
    filterOptions={filterOptions}
    value={value}
    onChange={(_, v) => onChange(v)}
    loading={loading}
    loadingText={loadingText}
    noOptionsText={loading ? "Se încarcă..." : "Fără opțiuni"}
    isOptionEqualToValue={(o, v) => o === v}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        fullWidth
        margin="normal"
        aria-busy={loading}
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

export default MultiSelectField;
