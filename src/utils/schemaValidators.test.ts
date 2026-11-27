import * as schemas from "../utils/schemaValidators";

const registration = {
  email: "ana@example.com",
  username: "ana",
  password: "secret1",
  phoneNumber: "0712345678",
};
const freelancer = {
  programmingLanguages: ["TypeScript"],
  foreignLanguages: [],
  experience: "5 years",
  rate: 50,
  currency: "EUR",
  portfolioUrl: "https://example.com",
};
const errorsOf = (schema: { validate: Validate }) =>
  schema.validate({}, { abortEarly: false }).then(
    () => [],
    (e: unknown) => (e as { errors: string[] }).errors,
  );
type Validate = (value: object, options: object) => Promise<unknown>;

it("requires login credentials", async () => {
  expect(await errorsOf(schemas.loginValidationSchema)).toEqual(
    expect.arrayContaining(["Username is required", "Password is required"]),
  );
});

it.each([
  ["email", "nope", "Invalid email"],
  ["password", "12345", "Password too short"],
  ["phoneNumber", "123", "Phone number must be exactly 10 digits"],
])("rejects a bad registration %s", async (field, value, message) => {
  await expect(
    schemas.registerValidationSchema.validate({
      ...registration,
      [field]: value,
    }),
  ).rejects.toThrow(message);
});

it("requires every address field", async () => {
  expect(await errorsOf(schemas.addressValidationSchema)).toHaveLength(5);
});

it.each([
  ["currency", "EURO", "Use 3-letter code"],
  ["programmingLanguages", [], "Select at least one language"],
  ["rate", -1, "Must be >= 0"],
  ["portfolioUrl", "nope", "Invalid URL"],
])("rejects a bad freelancer %s", async (field, value, message) => {
  await expect(
    schemas.freelnacerValidationSchema.validate({
      ...freelancer,
      [field]: value,
    }),
  ).rejects.toThrow(message);
});

it("requires a base64 image for user data", async () => {
  const bio = "A long enough biography";
  await expect(
    schemas.userDataValidationSchema.validate({ bio, image: "photo.png" }),
  ).rejects.toThrow("Image must be a valid base64 image");
});

it("validates account settings by field name", async () => {
  expect(Object.keys(schemas.accountGeneralFormSchema.fields).sort()).toEqual(
    Object.values(schemas.AccountGeneralFieldsNames).sort(),
  );
  await expect(
    schemas.accountGeneralFormSchema.validateAt("phone", { phone: "12" }),
  ).rejects.toThrow("Phone number must be exactly 10 digits");
});
