"use client";

import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import en from "@/messages/en.json";
import hi from "@/messages/hi.json";

const messages = { en, hi };

function IntlProviderWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  return (
    <NextIntlClientProvider locale={language} messages={messages[language]}>
      {children}
    </NextIntlClientProvider>
  );
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <IntlProviderWrapper>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </IntlProviderWrapper>
    </LanguageProvider>
  );
}
