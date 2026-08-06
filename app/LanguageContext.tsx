"use client";

import {
  createContext,
  useContext,
  useState,
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
  outgoingLanguage: Language | null;
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
  // Cikan dil burada tutuluyor ki yalnizca dugme degil, dile gore
  // degisen her etiket (ornegin "Mustafâ Hakkında") ayni kaymayi
  // oynatabilsin.
  const [outgoingLanguage, setOutgoingLanguage] = useState<Language | null>(
    null,
  );

  const cycleLanguage = () => {
    const current = getSnapshot();
    const nextIndex = (LANGUAGES.indexOf(current) + 1) % LANGUAGES.length;
    const next = LANGUAGES[nextIndex];
    setOutgoingLanguage(current);
    document.documentElement.lang = next;
    document.documentElement.dir = LANGUAGE_DIR[next];
    localStorage.setItem(LANGUAGE_KEY, next);
    listeners.forEach((listener) => listener());
    // Temizlik zamanlayiciyla: `animationend`'e baglanirsak animasyonun
    // hic calismadigi durumlarda cikan kopya DOM'da asili kaliyor.
    window.setTimeout(() => setOutgoingLanguage(null), 400);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        outgoingLanguage,
        t: TRANSLATIONS[language],
        cycleLanguage,
      }}
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
