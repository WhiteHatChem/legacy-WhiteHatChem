import fr_ui from './fr';
import en_ui from './en';
import de_ui from './de';
import es_ui from './es';
import ru_ui from './ru';

export const languages = {
  en: 'English',
  fr: 'Français',
  // de:'Deutsch',
  es:'Español',
  // ru:'Pусский',
};

export const languagesList = Object.keys(languages);

export const defaultLang = 'en';

export const ui = {
  en: en_ui,
  fr: fr_ui,
  // de:de_ui,
  es:es_ui,
  // ru:ru_ui
} as const;

export type Lang = keyof typeof ui;
export type LangKey = { lang: Lang };

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

// add language to internal href without language
export function i18n_href(href: string, lang: Lang) {
  return href.startsWith('/') ? `/${lang}${href}` : href;
}
