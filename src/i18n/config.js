import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ptBR from "./locales/pt-BR.json";
import enUS from "./locales/en-US.json";
import esES from "./locales/es-ES.json";
import frFR from "./locales/fr-FR.json";
import itIT from "./locales/it-IT.json";
import zhCN from "./locales/zh-CN.json";

const resources = {
  "pt-BR": {
    translation: ptBR,
  },
  "en-US": {
    translation: enUS,
  },
  "es-ES": {
    translation: esES,
  },
  "fr-FR": {
    translation: frFR,
  },
  "it-IT": {
    translation: itIT,
  },
  "zh-CN": {
    translation: zhCN,
  },
};

// Detectar idioma do navegador ou usar pt-BR como padrão
const savedLanguage = localStorage.getItem("language");
const browserLanguage = navigator.language || navigator.userLanguage;

// Mapear idiomas do navegador para os idiomas suportados
const getDefaultLanguage = (lang) => {
  if (lang.startsWith("pt")) return "pt-BR";
  if (lang.startsWith("es")) return "es-ES";
  if (lang.startsWith("fr")) return "fr-FR";
  if (lang.startsWith("it")) return "it-IT";
  if (lang.startsWith("zh")) return "zh-CN";
  return "en-US";
};

const defaultLanguage = savedLanguage || getDefaultLanguage(browserLanguage);

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: "pt-BR",
  interpolation: {
    escapeValue: false, // React já faz escape
  },
});

export default i18n;
