/** Storefront language (Phase 1: product/category content translation). */
export type Lang = "en" | "ar";

export const LANGS: { code: Lang; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

export const DEFAULT_LANG: Lang = "en";
export const LANG_COOKIE = "lang";

export function normalizeLang(v?: string | null): Lang {
  return v === "ar" ? "ar" : "en";
}

export function dirFor(lang: Lang): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

/** Client-only: read the current language from the cookie. */
export function getClientLang(): Lang {
  if (typeof document === "undefined") return DEFAULT_LANG;
  const m = document.cookie.match(/(?:^|;\s*)lang=([^;]+)/);
  return normalizeLang(m?.[1]);
}

/** Client-only: persist the chosen language for one year. */
export function setClientLang(lang: Lang) {
  if (typeof document === "undefined") return;
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=31536000; samesite=lax`;
}
