import {
  useFormik,
  type FormikConfig,
  type FormikProps,
  type FormikValues,
} from "formik";
import type * as Yup from "yup";

export function useForm<T extends FormikValues>(
  initialValues: T,
  validationSchema: Yup.AnyObjectSchema,
  onSubmit: FormikConfig<T>["onSubmit"],
  validateOnMount = false,
): FormikProps<T> {
  return useFormik<T>({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnMount,
  });
}
