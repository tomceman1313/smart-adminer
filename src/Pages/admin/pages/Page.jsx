import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import ConfigSettingValue from "./ConfigSettingValue";
import { motion } from "framer-motion";
import css from "./Pages.module.css";
import { useTranslation } from "react-i18next";

export default function Page({ page, redirectToPage, index }) {
	const { t } = useTranslation("pages");

	return (
		<motion.li
			className={css.page}
			initial={{ opacity: 0, x: "20px" }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: "20px" }}
			transition={{ delay: 0.1 * index }}
		>
			<div className={css.info}>
				<b>{page.info}</b>
			</div>
			<div className={css.page_configs}>
				<ConfigSettingValue name={t("configSettingsTitle")} isPermitted={page.config.title} />
				<ConfigSettingValue name={t("configSettingsDescription")} isPermitted={page.config.description} />
				<ConfigSettingValue name={t("configSettingsRichEditor")} isPermitted={page.config.rich_editor} />
				<ConfigSettingValue name={t("configSettingsImage")} isPermitted={page.config.image} />
			</div>
			<FontAwesomeIcon className={css.btn_open} icon={faPen} onClick={redirectToPage} />
		</motion.li>
	);
}
