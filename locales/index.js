import tr from './tr';
import en from './en';
import es from './es';

export const translations = {
  tr,
  en,
  es,
};

export const getTranslations = (locale) => {
  return translations[locale] || translations.tr;
};
