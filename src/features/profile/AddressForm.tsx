import { Box, Button } from "@mui/material";
import * as React from "react";
import { useSelector } from "react-redux";

import { useForm } from "../../hooks/useForm";
import type { AddressData } from "../../models/UserProfile";
import type { RootState } from "../../store";
import { addressValidationSchema } from "../../utils/schemaValidators";

import FormikTextField from "./FormikTextField";
import LocationAutocomplete from "./LocationAutocomplete";
import { useAddressData } from "./useAddressData";

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
      <LocationAutocomplete
        label="Country"
        options={countries}
        value={formik.values.addressCountry || null}
        loading={showCountriesLoading}
        touched={formik.touched.addressCountry}
        error={formik.errors.addressCountry}
        onChange={(newValue) => {
          void formik.setFieldTouched("addressCountry", true, false);
          // One update, so validation sees both new values.
          void formik.setValues({
            ...formik.values,
            addressCountry: newValue ?? "",
            addressCity: "",
          });
        }}
      />

      <LocationAutocomplete
        label="City"
        options={cities}
        value={formik.values.addressCity || null}
        loading={showCitiesLoading}
        disabled={!formik.values.addressCountry}
        touched={formik.touched.addressCity}
        error={formik.errors.addressCity}
        onChange={(newValue) => {
          void formik.setFieldValue("addressCity", newValue ?? "");
          void formik.setFieldTouched("addressCity", true, false);
        }}
      />

      <FormikTextField formik={formik} name="addressStreet" label="Street" />
      <FormikTextField
        formik={formik}
        name="addressStreetNumber"
        label="Street Number"
      />
      <FormikTextField formik={formik} name="addressZip" label="Zip" />

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
