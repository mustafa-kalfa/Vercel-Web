"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  LANGUAGES,
  LANGUAGE_DIR,
  TRANSLATIONS,
  type Language,
} from "./translations";

export const LANGUAGE_KEY = "language";

type LanguageContextValue = {
  language: Language;
  t: (typeof TRANSLATIONS)[Language];
  cycleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Tema gibi dil de <html lang> uzerinde tutuluyor: <head>'deki script
// kayitli tercihi ilk boyamadan once yaziyor, burada oradan okunuyor.
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function getSnapshot(): Language {
  const lang = document.documentElement.lang;
  return (LANGUAGES as string[]).includes(lang) ? (lang as Language) : "tr";
}

function getServerSnapshot(): Language {
  // layout.tsx <html lang="tr"> ile render ediyor.
  return "tr";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const cycleLanguage = () => {
    const nextIndex = (LANGUAGES.indexOf(getSnapshot()) + 1) % LANGUAGES.length;
    const next = LANGUAGES[nextIndex];
    document.documentElement.lang = next;
    document.documentElement.dir = LANGUAGE_DIR[next];
    localStorage.setItem(LANGUAGE_KEY, next);
    listeners.forEach((listener) => listener());
  };

  return (
    <LanguageContext.Provider
      value={{ language, t: TRANSLATIONS[language], cycleLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
