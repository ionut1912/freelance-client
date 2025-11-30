import type * as Yup from "yup";
import type { FormikProps, FormikValues } from "formik";
import { useFormik } from "formik";

export function useForm<T extends FormikValues>(
  initialValues: T,
  validationSchema: Yup.AnyObjectSchema,
  onSubmit: (values: T) => void,
  validateOnMount: boolean = false,
): FormikProps<T> {
  return useFormik<T>({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnMount,
  });
}
