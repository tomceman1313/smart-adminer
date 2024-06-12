import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SelectWithoutFormRef from "../../components/basic/select/SelectWithoutFormRef";

const LANGUAGES = [
	{ name: "Čeština", code: "cs" },
	{ name: "English", code: "en" },
];

export default function LanguageSelector({ showHeader = true }) {
	const { i18n, t } = useTranslation("settings");
	const [selectedLanguage, setSelectedLanguage] = useState(
		getCurrentLanguageName()
	);

	useEffect(() => {
		const language = LANGUAGES.find((lang) => lang.name === selectedLanguage);

		i18n.changeLanguage(language.code);
		localStorage.setItem("language", language.code);
		setSelectedLanguage(language.name);
	}, [selectedLanguage, i18n]);

	return (
		<div style={{ width: "100%" }}>
			{showHeader && <h3>{t("headerSystemLanguage")}</h3>}
			<SelectWithoutFormRef
				name="language"
				icon={faGlobe}
				defaultValue={selectedLanguage}
				setState={setSelectedLanguage}
				options={LANGUAGES.map((lang) => lang.name)}
				halfSize
			/>
		</div>
	);
}

function getCurrentLanguageName() {
	const languageCode = localStorage.getItem("language")
		? localStorage.getItem("language")
		: "cs";
	const currentLang = LANGUAGES.find((lang) => lang.code === languageCode);

	return currentLang.name;
}
