import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { CS } from "./locales/cs";
import { EN } from "./locales/en";

// the translations
const resources = {
	en: EN,
	cs: CS,
};

const defaultLanguage = localStorage.getItem("language");

i18n.use(initReactI18next).init({
	resources,
	lng: defaultLanguage ? defaultLanguage : "cs",
	fallbackLng: "cs",
	debug: false,

	interpolation: {
		escapeValue: false, // not needed for react as it escapes by default
	},
});

export default i18n;
