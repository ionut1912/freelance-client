import { Box, TextField, Autocomplete, Button } from "@mui/material";
import * as React from "react";
import { useSelector } from "react-redux";

import { useAddressData } from "../../hooks/useAddressData";
import { useForm } from "../../hooks/useForm";
import type { AddressData } from "../../models/UserProfile";
import type { RootState } from "../../store";
import { addressValidationSchema } from "../../utils/schemaValidators";
import Spinner from "../ui/Spinner";

interface AddressFormProps {
  initialValues?: AddressData;
  onSubmit: (values: AddressData) => void;
}

const DEFAULT_ADDR: AddressData = {
  addressCountry: "",
  addressCity: "",
  addressStreet: "",
  addressStreetNumber: "",
  addressZip: "",
};

const AddressForm = ({
  initialValues = DEFAULT_ADDR,
  onSubmit,
}: AddressFormProps) => {
  const [frozenInitials] = React.useState(initialValues);

  const formik = useForm<AddressData>(
    frozenInitials,
    addressValidationSchema,
    onSubmit,
    true,
  );

  const { countries, cities } = useAddressData(formik.values.addressCountry);
  const loadingCountries = useSelector(
    (state: RootState) => state.country.loading,
  );
  const loadingCities = useSelector((state: RootState) => state.city.loading);

  const showCountriesLoading = loadingCountries && countries.length === 0;
  // Cities are only requested once a country is chosen.
  const showCitiesLoading =
    !!formik.values.addressCountry && loadingCities && cities.length === 0;

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
      <Autocomplete<string>
        options={countries}
        value={formik.values.addressCountry || null}
        onChange={(_, newValue) => {
          void formik.setFieldTouched("addressCountry", true, false);
          // One update, so validation sees both new values.
          void formik.setValues({
            ...formik.values,
            addressCountry: newValue ?? "",
            addressCity: "",
          });
        }}
        loading={showCountriesLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Country"
            fullWidth
            margin="normal"
            error={
              !!(formik.touched.addressCountry && formik.errors.addressCountry)
            }
            helperText={
              formik.touched.addressCountry
                ? formik.errors.addressCountry
                : null
            }
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {showCountriesLoading ? <Spinner /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />

      <Autocomplete<string>
        options={cities}
        value={formik.values.addressCity || null}
        onChange={(_, newValue) => {
          void formik.setFieldValue("addressCity", newValue ?? "");
          void formik.setFieldTouched("addressCity", true, false);
        }}
        loading={showCitiesLoading}
        disabled={!formik.values.addressCountry}
        renderInput={(params) => (
          <TextField
            {...params}
            label="City"
            fullWidth
            margin="normal"
            error={!!(formik.touched.addressCity && formik.errors.addressCity)}
            helperText={
              formik.touched.addressCity ? formik.errors.addressCity : null
            }
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {showCitiesLoading ? <Spinner /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />

      <TextField
        label="Street"
        name="addressStreet"
        value={formik.values.addressStreet}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!(formik.touched.addressStreet && formik.errors.addressStreet)}
        helperText={
          formik.touched.addressStreet ? formik.errors.addressStreet : null
        }
        fullWidth
        margin="normal"
      />

      <TextField
        label="Street Number"
        name="addressStreetNumber"
        value={formik.values.addressStreetNumber}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={
          !!(
            formik.touched.addressStreetNumber &&
            formik.errors.addressStreetNumber
          )
        }
        helperText={
          formik.touched.addressStreetNumber
            ? formik.errors.addressStreetNumber
            : null
        }
        fullWidth
        margin="normal"
      />

      <TextField
        label="Zip"
        name="addressZip"
        value={formik.values.addressZip}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!(formik.touched.addressZip && formik.errors.addressZip)}
        helperText={formik.touched.addressZip ? formik.errors.addressZip : null}
        fullWidth
        margin="normal"
      />

      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button
          type="submit"
          variant="contained"
          disabled={!formik.isValid || !formik.dirty}
        >
          Save Address
        </Button>
      </Box>
    </Box>
  );
};

export default AddressForm;
