import { ui, defaultLenguage } from "@i18n/ui";

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLenguage;
  }
  
  export function useTranslations(lang: keyof typeof ui) {
    return function t(key: keyof typeof ui[typeof defaultLenguage]) {
      return ui[lang][key] || ui[defaultLenguage][key];
    }
  }
  