import { useState } from "react";
import cssBasic from "../../components/styles/Basic.module.css";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
	{ localName: "Čeština", code: "cs" },
	{ localName: "English", code: "en" },
];

export default function LanguageSelector({ showHeader = true }) {
	const { i18n, t } = useTranslation("settings");
	const [selectedLanguage, setSelectedLanguage] = useState(
		localStorage.getItem("language") ? localStorage.getItem("language") : "cs"
	);

	const onChangeHandler = (e) => {
		i18n.changeLanguage(e.target.value);
		localStorage.setItem("language", e.target.value);
		setSelectedLanguage(e.target.value);
	};

	return (
		<div style={{ width: "100%" }}>
			{showHeader && <h3>{t("headerSystemLanguage")}</h3>}
			<div className={`${cssBasic.input_box} ${cssBasic.half}`}>
				<select value={selectedLanguage} onChange={onChangeHandler}>
					{LANGUAGES.map((lang) => (
						<option key={lang.code} value={lang.code}>
							{lang.localName}
						</option>
					))}
				</select>
				<FontAwesomeIcon className={cssBasic.icon} icon={faGlobe} />
			</div>
		</div>
	);
}
