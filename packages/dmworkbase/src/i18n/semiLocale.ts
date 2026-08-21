import enUS from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
import zhCN from "@douyinfe/semi-ui/lib/es/locale/source/zh_CN";
import type { Locale as SemiLocale } from "@douyinfe/semi-ui/lib/es/locale/interface";
import { getTextDirection } from "./direction";
import { Locale } from "./types";

export const semiLocales: Record<Locale, SemiLocale> = {
  "zh-CN": zhCN,
  "en-US": enUS,
};

export function getSemiLocale(locale: Locale) {
  return semiLocales[locale];
}

export function getSemiDirection(locale: Locale) {
  return getTextDirection(locale);
}
