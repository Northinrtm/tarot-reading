"use client";

import { useEffect, useSyncExternalStore } from "react";
import { SpreadReading } from "@/components/SpreadReading";
import { Locale, UI_TEXT } from "@/lib/i18n";

const LANGUAGE_STORAGE_KEY = "tarot-language";
const LANGUAGE_CHANGE_EVENT = "tarot-language-change";

function getLanguageSnapshot(): Locale {
  const savedLocale = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLocale === "ru" || savedLocale === "en") return savedLocale;
  return navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en";
}

function getServerLanguageSnapshot(): Locale {
  return "ru";
}

function subscribeToLanguage(callback: () => void) {
  const handleChange = () => callback();
  window.addEventListener("storage", handleChange);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, handleChange);
  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleChange);
  };
}

function saveLanguage(locale: Locale) {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
}

export default function Home() {
  const locale = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function changeLocale(nextLocale: Locale) {
    saveLanguage(nextLocale);
  }

  const text = UI_TEXT[locale];

  return (
    <div className="relative flex min-h-screen flex-1 flex-col items-center bg-gradient-to-b from-black via-indigo-950 to-black px-6 py-16">
      <div
        className="absolute right-4 top-4 flex rounded-lg border border-violet-400/30 bg-violet-950/70 p-1 text-xs font-medium"
        aria-label={locale === "ru" ? "Выбор языка" : "Language selector"}
      >
        {(["ru", "en"] as const).map((language) => (
          <button
            key={language}
            type="button"
            onClick={() => changeLocale(language)}
            aria-pressed={locale === language}
            className={`rounded-md px-2.5 py-1.5 transition-colors ${
              locale === language
                ? "bg-violet-600 text-white"
                : "text-violet-300 hover:text-white"
            }`}
          >
            {language.toUpperCase()}
          </button>
        ))}
      </div>
      <header className="flex flex-col items-center gap-2 mb-12 text-center">
        <h1 className="text-4xl font-semibold text-violet-100 tracking-tight">{text.title}</h1>
        <p className="text-violet-400 max-w-md">{text.subtitle}</p>
      </header>
      <main className="flex-1 w-full flex justify-center">
        <SpreadReading key={locale} locale={locale} />
      </main>
    </div>
  );
}
