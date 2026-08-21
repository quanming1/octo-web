import { I18nService } from "./I18nService";
import enUS from "./locales/en-US.json";
import zhCN from "./locales/zh-CN.json";
import { TranslateOptions } from "./types";

export const i18n = new I18nService();

i18n.registerNamespace("base", {
  "zh-CN": zhCN,
  "en-US": enUS,
});
i18n.init();

export function t(key: string, options?: TranslateOptions) {
  return i18n.t(key, options);
}
