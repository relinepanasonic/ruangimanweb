export const locales = ["id", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "id";

export const localeLabels: Record<Locale, string> = {
  id: "ID",
  en: "EN",
};

/** Full BCP-47 tags for <html lang> and hreflang alternates. */
export const localeHtmlLang: Record<Locale, string> = {
  id: "id-ID",
  en: "en",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
