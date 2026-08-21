import { Locale, TextDirection } from "./types";

const rtlLocales = new Set<Locale>();

export function getTextDirection(locale: Locale): TextDirection {
  return rtlLocales.has(locale) ? "rtl" : "ltr";
}
