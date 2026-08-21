import React, { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { ConfigProvider, LocaleProvider } from "@douyinfe/semi-ui";
import { createI18nFormatter } from "./format";
import { i18n } from "./instance";
import { getSemiDirection, getSemiLocale } from "./semiLocale";
import { Locale } from "./types";

export interface I18nContextValue {
  format: ReturnType<typeof createI18nFormatter>;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof i18n.t;
}

export const I18nContext = createContext<I18nContextValue>({
  format: i18n.format,
  locale: i18n.getLocale(),
  setLocale: (locale) => i18n.setLocale(locale),
  t: i18n.t.bind(i18n),
});

export interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(i18n.getLocale());

  useEffect(() => i18n.subscribe(setLocaleState), []);

  const value = useMemo<I18nContextValue>(() => ({
    format: createI18nFormatter(locale),
    locale,
    setLocale: (nextLocale) => i18n.setLocale(nextLocale),
    t: i18n.t.bind(i18n),
  }), [locale]);
  const semiLocale = getSemiLocale(locale);
  const semiDirection = getSemiDirection(locale);

  return (
    <ConfigProvider locale={semiLocale} direction={semiDirection}>
      <LocaleProvider locale={semiLocale}>
        <I18nContext.Provider value={value}>
          {children}
        </I18nContext.Provider>
      </LocaleProvider>
    </ConfigProvider>
  );
}
