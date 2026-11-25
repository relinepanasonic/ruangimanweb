import { defaultLocale, isLocale, type Locale } from "./config";
import id, { type Dictionary } from "./dictionaries/id";
import en from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { id, en };

/**
 * Both dictionaries are plain modules, so this is synchronous and tree-shakes
 * fine — no need for the dynamic-import dance the Next.js i18n example uses.
 */
export function getDictionary(lang: string): Dictionary {
  return dictionaries[isLocale(lang) ? lang : defaultLocale];
}

export type { Dictionary };
