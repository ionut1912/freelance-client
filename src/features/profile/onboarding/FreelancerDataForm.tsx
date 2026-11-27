import { Box, TextField, Button } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import * as React from "react";

import { useForm } from "../../../hooks/useForm";
import type { FreelancerData } from "../../../models/UserProfile";
import { freelancerValidationSchema } from "../../../utils/schemaValidators";

import MultiSelectField from "./MultiSelectField";
import { useFreelancerOptions } from "./useFreelancerOptions";

interface FreelancerDataFormProps {
  initialValues?: FreelancerData;
  onSubmit: (values: FreelancerData) => void;
}

const DEFAULT_FREELANCER: FreelancerData = {
  programmingLanguages: [],
  foreignLanguages: [],
  experience: "",
  rate: 0,
  currency: "",
  portfolioUrl: "",
};

const languageFilter = createFilterOptions<string>({
  ignoreAccents: true,
  ignoreCase: true,
  matchFrom: "any",
  stringify: (o) => o,
  limit: 200,
});

const FreelancerDataForm = ({
  initialValues = DEFAULT_FREELANCER,
  onSubmit,
}: FreelancerDataFormProps) => {
  const [frozenInitials] = React.useState(initialValues);

  const {
    programmingLanguageOptions,
    languageOptions,
    loadingSkills,
    loadingLanguages,
  } = useFreelancerOptions();

  const formik = useForm<FreelancerData>(
    frozenInitials,
    freelancerValidationSchema,
    onSubmit,
    true,
  );

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
      <MultiSelectField
        label="Programming Languages"
        options={programmingLanguageOptions}
        value={formik.values.programmingLanguages}
        loading={loadingSkills}
        loadingText="Se încarcă limbajele..."
        touched={!!formik.touched.programmingLanguages}
        error={formik.errors.programmingLanguages}
        onChange={(v) => {
          void formik.setFieldValue("programmingLanguages", v);
          void formik.setFieldTouched("programmingLanguages", true, false);
        }}
      />

      <MultiSelectField
        label="Foreign Languages"
        freeSolo
        options={languageOptions}
        filterOptions={languageFilter}
        value={formik.values.foreignLanguages}
        loading={loadingLanguages}
        loadingText="Se încarcă limbile străine..."
        touched={!!formik.touched.foreignLanguages}
        error={formik.errors.foreignLanguages}
        onChange={(v) => {
          void formik.setFieldValue("foreignLanguages", v);
          void formik.setFieldTouched("foreignLanguages", true, false);
        }}
      />

      <TextField
        label="Experience"
        name="experience"
        value={formik.values.experience || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!(formik.touched.experience && formik.errors.experience)}
        helperText={formik.touched.experience ? formik.errors.experience : null}
        fullWidth
        margin="normal"
        placeholder="ex: 5+ ani în dezvoltare backend"
      />

      <TextField
        label="Rate"
        type="number"
        slotProps={{ htmlInput: { step: "0.01", min: "0" } }}
        value={formik.values.rate}
        onChange={(e) => {
          const raw = e.target.value;
          void formik.setFieldValue("rate", raw === "" ? 0 : Number(raw));
        }}
        onBlur={() => formik.setFieldTouched("rate", true)}
        error={!!(formik.touched.rate && formik.errors.rate)}
        helperText={formik.touched.rate ? formik.errors.rate : null}
        fullWidth
        margin="normal"
        placeholder="ex: 50"
      />

      <TextField
        label="Currency"
        name="currency"
        value={formik.values.currency || ""}
        onChange={(e) =>
          formik.setFieldValue("currency", e.target.value.toUpperCase())
        }
        onBlur={formik.handleBlur}
        error={!!(formik.touched.currency && formik.errors.currency)}
        helperText={formik.touched.currency ? formik.errors.currency : null}
        fullWidth
        margin="normal"
        placeholder="ex: EUR, USD, RON"
      />

      <TextField
        label="Portfolio URL"
        name="portfolioUrl"
        type="url"
        value={formik.values.portfolioUrl || ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={!!(formik.touched.portfolioUrl && formik.errors.portfolioUrl)}
        helperText={
          formik.touched.portfolioUrl ? formik.errors.portfolioUrl : null
        }
        fullWidth
        margin="normal"
        placeholder="https://example.com"
      />

      <Box display="flex" justifyContent="flex-end" mt={3}>
        <Button
          type="submit"
          variant="contained"
          disabled={!formik.isValid || !formik.dirty}
        >
          Save Freelancer Details
        </Button>
      </Box>
    </Box>
  );
};

export default FreelancerDataForm;
