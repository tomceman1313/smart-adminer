import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import menuCS from "./locales/cs/menu.json";
import menuEN from "./locales/en/menu.json";

import bannerCS from "./locales/cs/banner.json";
import bannerEN from "./locales/en/banner.json";

import profilesCS from "./locales/cs/profiles.json";
import profilesEN from "./locales/en/profiles.json";

import employeesCS from "./locales/cs/employees.json";
import employeesEN from "./locales/en/employees.json";

import pagesCS from "./locales/cs/pages.json";
import pagesEN from "./locales/en/pages.json";

import galleryCS from "./locales/cs/gallery.json";
import galleryEN from "./locales/en/gallery.json";

import categoriesComponentCS from "./locales/cs/components/categories.json";
import categoriesComponentEN from "./locales/en/components/categories.json";

// the translations
const resources = {
	en: {
		menu: menuEN,
		banner: bannerEN,
		profiles: profilesEN,
		employees: employeesEN,
		pages: pagesEN,
		gallery: galleryEN,
		categoriesC: categoriesComponentEN,
	},
	cs: {
		menu: menuCS,
		banner: bannerCS,
		profiles: profilesCS,
		employees: employeesCS,
		pages: pagesCS,
		gallery: galleryCS,
		categoriesC: categoriesComponentCS,
	},
};

i18n.use(initReactI18next).init({
	ns: ["menu", "banner", "profiles", "employees", "pages", "gallery", "categoriesC"],
	resources,
	lng: "cs",
	fallbackLng: "cs",
	debug: true,

	interpolation: {
		escapeValue: false, // not needed for react as it escapes by default
	},
});

export default i18n;
