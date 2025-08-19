import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

// UI çevirileri
import { uiTr } from '@errors/locales/modules/ui/tr';
import { uiEn } from '@errors/locales/modules/ui/en';
import { uiAr } from '@errors/locales/modules/ui/ar';
import { uiZh } from '@errors/locales/modules/ui/zh';
import { uiDe } from '@errors/locales/modules/ui/de';
import { uiEs } from '@errors/locales/modules/ui/es';
import { uiFr } from '@errors/locales/modules/ui/fr';
import { uiHi } from '@errors/locales/modules/ui/hi';
import { uiPt } from '@errors/locales/modules/ui/pt';
import { uiRu } from '@errors/locales/modules/ui/ru';
import { uiIt } from '@errors/locales/modules/ui/it';
import { uiNl } from '@errors/locales/modules/ui/nl';
import { uiKo } from '@errors/locales/modules/ui/ko';
import { uiJa } from '@errors/locales/modules/ui/ja';
import { uiSv } from '@errors/locales/modules/ui/sv';
import { uiNo } from '@errors/locales/modules/ui/no';
import { uiDa } from '@errors/locales/modules/ui/da';
import { uiFi } from '@errors/locales/modules/ui/fi';
import { uiPl } from '@errors/locales/modules/ui/pl';
import { uiCs } from '@errors/locales/modules/ui/cs';
import { uiEl } from '@errors/locales/modules/ui/el';
import { uiHe } from '@errors/locales/modules/ui/he';
import { uiHu } from '@errors/locales/modules/ui/hu';
import { uiRo } from '@errors/locales/modules/ui/ro';
import { uiSk } from '@errors/locales/modules/ui/sk';
import { uiUk } from '@errors/locales/modules/ui/uk';
import { uiVi } from '@errors/locales/modules/ui/vi';
import { uiId } from '@errors/locales/modules/ui/id';
import { uiMs } from '@errors/locales/modules/ui/ms';
import { uiTh } from '@errors/locales/modules/ui/th';
import { uiBn } from '@errors/locales/modules/ui/bn';
import { uiTa } from '@errors/locales/modules/ui/ta';
import { uiTe } from '@errors/locales/modules/ui/te';
import { uiMr } from '@errors/locales/modules/ui/mr';
import { uiFa } from '@errors/locales/modules/ui/fa';
import { uiUr } from '@errors/locales/modules/ui/ur';
import { uiBg } from '@errors/locales/modules/ui/bg';
import { uiHr } from '@errors/locales/modules/ui/hr';
import { uiSr } from '@errors/locales/modules/ui/sr';
import { uiSl } from '@errors/locales/modules/ui/sl';
import { uiLt } from '@errors/locales/modules/ui/lt';
import { uiLv } from '@errors/locales/modules/ui/lv';
import { uiEt } from '@errors/locales/modules/ui/et';
import { uiSw } from '@errors/locales/modules/ui/sw';
import { uiAf } from '@errors/locales/modules/ui/af';
import { uiIs } from '@errors/locales/modules/ui/is';
import { uiGa } from '@errors/locales/modules/ui/ga';
import { uiMt } from '@errors/locales/modules/ui/mt';
import { uiAm } from '@errors/locales/modules/ui/am';
import { uiHy } from '@errors/locales/modules/ui/hy';

// Backend çevirileri
import backendCommonTr from '@errors/locales/modules/backend/common/tr';
import backendCommonEn from '@errors/locales/modules/backend/common/en';
import backendCommonAr from '@errors/locales/modules/backend/common/ar';
import backendCommonZh from '@errors/locales/modules/backend/common/zh';
import backendCommonDe from '@errors/locales/modules/backend/common/de';
import backendCommonEs from '@errors/locales/modules/backend/common/es';
import backendCommonFr from '@errors/locales/modules/backend/common/fr';
import backendCommonHi from '@errors/locales/modules/backend/common/hi';
import backendCommonPt from '@errors/locales/modules/backend/common/pt';
import backendCommonRu from '@errors/locales/modules/backend/common/ru';
import backendCommonIt from '@errors/locales/modules/backend/common/it';
import backendCommonNl from '@errors/locales/modules/backend/common/nl';
import backendCommonKo from '@errors/locales/modules/backend/common/ko';
import backendCommonJa from '@errors/locales/modules/backend/common/ja';
import backendCommonSv from '@errors/locales/modules/backend/common/sv';
import backendCommonNo from '@errors/locales/modules/backend/common/no';
import backendCommonDa from '@errors/locales/modules/backend/common/da';
import backendCommonFi from '@errors/locales/modules/backend/common/fi';
import backendCommonPl from '@errors/locales/modules/backend/common/pl';
import backendCommonCs from '@errors/locales/modules/backend/common/cs';
import backendCommonEl from '@errors/locales/modules/backend/common/el';
import backendCommonHe from '@errors/locales/modules/backend/common/he';
import backendCommonHu from '@errors/locales/modules/backend/common/hu';
import backendCommonRo from '@errors/locales/modules/backend/common/ro';
import backendCommonSk from '@errors/locales/modules/backend/common/sk';
import backendCommonUk from '@errors/locales/modules/backend/common/uk';
import backendCommonVi from '@errors/locales/modules/backend/common/vi';
import backendCommonId from '@errors/locales/modules/backend/common/id';
import backendCommonMs from '@errors/locales/modules/backend/common/ms';
import backendCommonTh from '@errors/locales/modules/backend/common/th';
import backendCommonBn from '@errors/locales/modules/backend/common/bn';
import backendCommonTa from '@errors/locales/modules/backend/common/ta';
import backendCommonTe from '@errors/locales/modules/backend/common/te';
import backendCommonMr from '@errors/locales/modules/backend/common/mr';
import backendCommonFa from '@errors/locales/modules/backend/common/fa';
import backendCommonUr from '@errors/locales/modules/backend/common/ur';
import backendCommonBg from '@errors/locales/modules/backend/common/bg';
import backendCommonHr from '@errors/locales/modules/backend/common/hr';
import backendCommonSr from '@errors/locales/modules/backend/common/sr';
import backendCommonSl from '@errors/locales/modules/backend/common/sl';
import backendCommonLt from '@errors/locales/modules/backend/common/lt';
import backendCommonLv from '@errors/locales/modules/backend/common/lv';
import backendCommonEt from '@errors/locales/modules/backend/common/et';
import backendCommonSw from '@errors/locales/modules/backend/common/sw';
import backendCommonAf from '@errors/locales/modules/backend/common/af';
import backendCommonIs from '@errors/locales/modules/backend/common/is';
import backendCommonGa from '@errors/locales/modules/backend/common/ga';
import backendCommonMt from '@errors/locales/modules/backend/common/mt';
import backendCommonAm from '@errors/locales/modules/backend/common/am';
import backendCommonHy from '@errors/locales/modules/backend/common/hy';

// Şimdilik animalmarket için common dosyaları kullanıyoruz (tr ve en)
// (ve diğer diller de aynı şekilde devam eder...)

// 🧠 Merge fonksiyonu
const mergeTranslations = (...objects: any[]) =>
  objects.reduce((acc, obj) => {
    for (const ns in obj.translation) {
      acc[ns] = {
        ...(acc[ns] || {}),
        ...obj.translation[ns],
      };
    }
    return acc;
  }, {} as any);

// 🌐 Kaynaklar
const resources = {
  tr: { translation: mergeTranslations(uiTr, backendCommonTr) },
  en: { translation: mergeTranslations(uiEn, backendCommonEn) },
  ar: { translation: mergeTranslations(uiAr, backendCommonAr, backendCommonAr) },
  zh: { translation: mergeTranslations(uiZh, backendCommonZh, backendCommonZh) },
  de: { translation: mergeTranslations(uiDe, backendCommonDe, backendCommonDe) },
  es: { translation: mergeTranslations(uiEs, backendCommonEs, backendCommonEs) },
  fr: { translation: mergeTranslations(uiFr, backendCommonFr, backendCommonFr) },
  hi: { translation: mergeTranslations(uiHi, backendCommonHi, backendCommonHi) },
  pt: { translation: mergeTranslations(uiPt, backendCommonPt, backendCommonPt) },
  ru: { translation: mergeTranslations(uiRu, backendCommonRu, backendCommonRu) },
  it: { translation: mergeTranslations(uiIt, backendCommonIt, backendCommonIt) },
  nl: { translation: mergeTranslations(uiNl, backendCommonNl, backendCommonNl) },
  ko: { translation: mergeTranslations(uiKo, backendCommonKo, backendCommonKo) },
  ja: { translation: mergeTranslations(uiJa, backendCommonJa, backendCommonJa) },
  sv: { translation: mergeTranslations(uiSv, backendCommonSv, backendCommonSv) },
  no: { translation: mergeTranslations(uiNo, backendCommonNo, backendCommonNo) },
  da: { translation: mergeTranslations(uiDa, backendCommonDa, backendCommonDa) },
  fi: { translation: mergeTranslations(uiFi, backendCommonFi, backendCommonFi) },
  pl: { translation: mergeTranslations(uiPl, backendCommonPl, backendCommonPl) },
  cs: { translation: mergeTranslations(uiCs, backendCommonCs, backendCommonCs) },
  el: { translation: mergeTranslations(uiEl, backendCommonEl, backendCommonEl) },
  he: { translation: mergeTranslations(uiHe, backendCommonHe, backendCommonHe) },
  hu: { translation: mergeTranslations(uiHu, backendCommonHu, backendCommonHu) },
  ro: { translation: mergeTranslations(uiRo, backendCommonRo, backendCommonRo) },
  sk: { translation: mergeTranslations(uiSk, backendCommonSk, backendCommonSk) },
  uk: { translation: mergeTranslations(uiUk, backendCommonUk, backendCommonUk) },
  vi: { translation: mergeTranslations(uiVi, backendCommonVi, backendCommonVi) },
  id: { translation: mergeTranslations(uiId, backendCommonId, backendCommonId) },
  ms: { translation: mergeTranslations(uiMs, backendCommonMs, backendCommonMs) },
  th: { translation: mergeTranslations(uiTh, backendCommonTh, backendCommonTh) },
  bn: { translation: mergeTranslations(uiBn, backendCommonBn, backendCommonBn) },
  ta: { translation: mergeTranslations(uiTa, backendCommonTa, backendCommonTa) },
  te: { translation: mergeTranslations(uiTe, backendCommonTe, backendCommonTe) },
  mr: { translation: mergeTranslations(uiMr, backendCommonMr, backendCommonMr) },
  fa: { translation: mergeTranslations(uiFa, backendCommonFa, backendCommonFa) },
  ur: { translation: mergeTranslations(uiUr, backendCommonUr, backendCommonUr) },
  bg: { translation: mergeTranslations(uiBg, backendCommonBg, backendCommonBg) },
  hr: { translation: mergeTranslations(uiHr, backendCommonHr, backendCommonHr) },
  sr: { translation: mergeTranslations(uiSr, backendCommonSr, backendCommonSr) },
  sl: { translation: mergeTranslations(uiSl, backendCommonSl, backendCommonSl) },
  lt: { translation: mergeTranslations(uiLt, backendCommonLt, backendCommonLt) },
  lv: { translation: mergeTranslations(uiLv, backendCommonLv, backendCommonLv) },
  et: { translation: mergeTranslations(uiEt, backendCommonEt, backendCommonEt) },
  sw: { translation: mergeTranslations(uiSw, backendCommonSw, backendCommonSw) },
  af: { translation: mergeTranslations(uiAf, backendCommonAf, backendCommonAf) },
  is: { translation: mergeTranslations(uiIs, backendCommonIs, backendCommonIs) },
  ga: { translation: mergeTranslations(uiGa, backendCommonGa, backendCommonGa) },
  mt: { translation: mergeTranslations(uiMt, backendCommonMt, backendCommonMt) },
  am: { translation: mergeTranslations(uiAm, backendCommonAm, backendCommonAm) },
  hy: { translation: mergeTranslations(uiHy, backendCommonHy, backendCommonHy) },
};

// 📦 AsyncStorage key
const LANGUAGE_STORAGE_KEY = 'selectedLanguage';

// 🚀 Başlat
const initLanguage = async () => {
  try {
    const storedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    const deviceLang = Localization.getLocales()?.[0]?.languageCode ?? 'tr';
    const fallbackLang = (Object.keys(resources).includes(deviceLang) ? deviceLang : 'tr') as keyof typeof resources;
    const selectedLang = storedLang ?? fallbackLang;

    await i18n
      .use(initReactI18next)
      .init({
        fallbackLng: 'tr',
        lng: selectedLang,
        resources,
        react: {
          useSuspense: false,
        },
        interpolation: {
          escapeValue: false,
        },
      });

    console.log(`✅ i18n initialized with language: ${selectedLang}`);
  } catch (error) {
    console.error('❌ i18n init failed', error);
  }
};

initLanguage();

export default i18n;
