import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import type { useCurrentUser } from "../../../hooks/useCurrentUser";
import type { UpdateUserRequest } from "../../../models/Ui";
import type { AppDispatch } from "../../../store";
import { patchUserData } from "../../../store/user-profile/thunks";
import {
  accountGeneralFormSchema,
  type AccountGeneralForm,
} from "../../../utils/schemaValidators";

type CurrentUser = ReturnType<typeof useCurrentUser>;

/** The account form, filled from the profile and saved back to it. */
export function useAccountForm(
  user: CurrentUser["clientProfile"] | CurrentUser["freelancerProfile"],
) {
  const dispatch = useDispatch<AppDispatch>();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<AccountGeneralForm>({
    resolver: yupResolver(accountGeneralFormSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      bio: "",
      image: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (user) {
      const values = {
        username: user.user.username || "",
        email: user.user.email || "",
        phone: user.user.phoneNumber || "",
        bio: user.bio || "",
        image: user.image || "",
      };
      reset(values);
    }
  }, [user, reset]);

  const handleSave = useCallback(
    async (data: AccountGeneralForm) => {
      setSaving(true);
      try {
        const updateUser: UpdateUserRequest = {
          username: data.username,
          email: data.email,
          phoneNumber: data.phone,
          bio: data.bio || "",
        };
        await dispatch(patchUserData(updateUser));
      } finally {
        setSaving(false);
      }
    },
    [dispatch],
  );

  return {
    register,
    errors,
    getValues,
    reset,
    saving,
    onSubmit: handleSubmit(handleSave),
  };
}
