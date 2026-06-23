import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import it from './locales/it.json';

/** Langues d'interface disponibles. */
export const LANGS = ['fr', 'en', 'es', 'de', 'it'] as const;
export type Lang = (typeof LANGS)[number];

/** Drapeau emoji pour le sélecteur de langue. */
export const LANG_FLAGS: Record<Lang, string> = {
  fr: '🇫🇷',
  en: '🇬🇧',
  es: '🇪🇸',
  de: '🇩🇪',
  it: '🇮🇹',
};

const STORAGE_KEY = 'geoquizz.lang';

function detectInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (LANGS as readonly string[]).includes(stored)) return stored as Lang;
  } catch {
    /* localStorage indisponible : on retombe sur la détection navigateur */
  }
  const nav = typeof navigator !== 'undefined' ? navigator.language.slice(0, 2) : 'fr';
  return (LANGS as readonly string[]).includes(nav) ? (nav as Lang) : 'fr';
}

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    es: { translation: es },
    de: { translation: de },
    it: { translation: it },
  },
  lng: detectInitialLang(),
  fallbackLng: 'fr',
  interpolation: { escapeValue: false }, // React échappe déjà
});

/** Change la langue d'interface et la mémorise. */
export function setLang(lang: Lang): void {
  i18n.changeLanguage(lang);
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}

export default i18n;
