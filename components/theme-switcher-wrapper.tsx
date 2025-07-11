"use client";

import { ThemeSwitcher as OriginalThemeSwitcher } from "./theme-switcher";
import { useMessages, useLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";

export function ThemeSwitcherWrapper() {
  const messages = useMessages();
  const locale = useLocale();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <OriginalThemeSwitcher />
    </NextIntlClientProvider>
  );
}
