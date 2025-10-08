import * as Yup from "yup";

export const addressValidationSchema = Yup.object({
  addressCountry: Yup.string().required("Country is required"),
  addressCity: Yup.string().required("City is required"),
  addressStreet: Yup.string().required("Street is required"),
  addressStreetNumber: Yup.string().required("Street number is required"),
  addressZip: Yup.string().required("Zip is required"),
});

export const freelnacerValidationSchema = Yup.object({
  programmingLanguages: Yup.array()
    .of(Yup.string().trim().required())
    .min(1, "Select at least one language")
    .required(),
  foreignLanguages: Yup.array()
    .of(Yup.string().trim().required())
    .max(10, "Too many items")
    .required(),

  experience: Yup.string()
    .trim()
    .min(3, "Too short")
    .required("Experience is required"),

  rate: Yup.number()
    .typeError("Must be a number")
    .min(0, "Must be >= 0")
    .max(10000, "Too high")
    .required("Rate is required"),

  currency: Yup.string()
    .trim()
    .matches(/^[A-Za-z]{3}$/, "Use 3-letter code")
    .required("Currency is required"),

  portfolioUrl: Yup.string()
    .trim()
    .url("Invalid URL")
    .required("Portfolio is required"),
});

export const loginValidationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

export const registerValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(6, "Password too short")
    .required("Password is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]+$/, "Only digits")
    .required("Phone number is required"),
});

export const userDataValidationSchema = Yup.object({
  bio: Yup.string()
    .trim()
    .min(10, "Bio must be at least 10 characters")
    .required("Bio is required"),
  image: Yup.string()
    .required("Image is required")
    .matches(
      /^data:image\/[a-zA-Z]+;base64,/,
      "Image must be a valid base64 image",
    ),
});

export enum AccountGeneralFieldsNames {
  username = "username",
  email = "email",
  phone = "phone",
  bio = "bio",
  image = "image",
}

export const accountGeneralFormSchema = Yup.object({
  [AccountGeneralFieldsNames.username]: Yup.string().required(),
  [AccountGeneralFieldsNames.email]: Yup.string().email().required(),
  [AccountGeneralFieldsNames.phone]: Yup.string().required(),
  [AccountGeneralFieldsNames.image]: Yup.string().optional().defined(),
  [AccountGeneralFieldsNames.bio]: Yup.string().optional().defined(),
});

export type AccountGeneralForm = Yup.InferType<typeof accountGeneralFormSchema>;
