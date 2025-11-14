export function hasErrorsForLang(errors: any, lang: "en" | "hi"): boolean {
  if (!errors) return false;

  // Direct error at this level
  if (typeof errors === "string") return true;

  if (typeof errors === "object") {
    // Check if there's an error for the current language key
    if (
      errors.hasOwnProperty(lang) &&
      (typeof errors[lang] === "string" || (errors[lang] && Object.keys(errors[lang]).length > 0))
    ) {
      return true;
    }

    // Check other nested keys (excluding direct lang keys to avoid double-checking)
    return Object.entries(errors).some(([key, value]) => {
      if (key === "en" || key === "hi") return false;
      return hasErrorsForLang(value, lang);
    });
  }

  return false;
}
