import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { Language } from "../../../models/ExternalApis";
import type { SkillDto } from "../../../models/UserProfile";
import type { AppDispatch, RootState } from "../../../store";
import { loadLanguages } from "../../../store/language/thunks";
import { loadSkills } from "../../../store/skills/thunks";

/** Loads and shapes the choices offered by the freelancer form. */
export function useFreelancerOptions() {
  const dispatch = useDispatch<AppDispatch>();
  const skills = useSelector((s: RootState) => s.skill.skills);
  const languagesRaw = useSelector((s: RootState) => s.language.languages);
  const loadingSkills = useSelector((s: RootState) => s.skill.loading);
  const loadingLanguages = useSelector((s: RootState) => s.language.loading);

  useEffect(() => {
    void dispatch(loadSkills());
    void dispatch(loadLanguages());
  }, [dispatch]);

  const programmingLanguageOptions = useMemo(
    () =>
      Array.from(
        new Set(
          skills
            .map((s: SkillDto) => s.programmingLanguage)
            .filter((v): v is string => !!v),
        ),
      ).sort(),
    [skills],
  );

  const languageOptions = useMemo(
    () =>
      Array.from(
        new Set(
          languagesRaw
            .map((l: Language | string) => (typeof l === "string" ? l : l.name))
            .filter((v): v is string => !!v),
        ),
      ).sort(),
    [languagesRaw],
  );

  return {
    programmingLanguageOptions,
    languageOptions,
    loadingSkills,
    loadingLanguages,
  };
}
