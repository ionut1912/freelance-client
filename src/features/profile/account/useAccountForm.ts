import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import type { useCurrentProfile } from "../../../hooks/useCurrentProfile";
import type { UpdateUserRequest } from "../../../models/Ui";
import type { AppDispatch } from "../../../store";
import { patchUserData } from "../../../store/user-profile/thunks";
import {
  accountGeneralFormSchema,
  type AccountGeneralForm,
} from "../../../utils/schemaValidators";

/** The account form, filled from the profile and saved back to it. */
export function useAccountForm(
  user: ReturnType<typeof useCurrentProfile>["profile"],
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

  const handleSave = async (data: AccountGeneralForm) => {
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
  };

  return {
    register,
    errors,
    getValues,
    reset,
    saving,
    onSubmit: handleSubmit(handleSave),
  };
}
