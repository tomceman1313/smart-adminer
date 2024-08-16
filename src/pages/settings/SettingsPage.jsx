import React from "react";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import LoginScreenBackgroundPicker from "./LoginScreenBackgroundPicker";
import TextEditor from "../../components/basic/text-editor/TextEditor";

export default function SettingsPage() {
	const { t } = useTranslation("settings");

	return (
		<section>
			<Helmet>
				<title>{t("htmlSettingsTitle")}</title>
			</Helmet>
			<h2>{t("headerSettings")}</h2>

			<LanguageSelector />

			<LoginScreenBackgroundPicker />

			<TextEditor />
		</section>
	);
}
