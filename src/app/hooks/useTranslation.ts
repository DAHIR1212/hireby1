import { useLanguage } from '../context/LanguageContext.tsx';
import { translations, TranslationKey } from '../translations/index.ts';

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.EN[key] || key;
  };

  return { t, language };
}
