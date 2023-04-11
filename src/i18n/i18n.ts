import fr_ui from './fr';
import en_ui from './en';

export const languages = {
  en: 'English',
  fr: 'Français',
};

export const languagesList = Object.keys(languages);

export const defaultLang = 'en';

export const ui = {
  en: en_ui,
  fr: fr_ui,
} as const;

export type Lang = keyof typeof ui;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}