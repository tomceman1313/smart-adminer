import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import ConfigSettingValue from "./ConfigSettingValue";
import { motion } from "framer-motion";
import css from "./Pages.module.css";

export default function Page({ page, redirectToPage, index }) {
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
				<ConfigSettingValue name="Nadpis" isPermitted={page.config.title} />
				<ConfigSettingValue name="Popisek" isPermitted={page.config.description} />
				<ConfigSettingValue name="Rozšířený editor" isPermitted={page.config.rich_editor} />
				<ConfigSettingValue name="Obrázek" isPermitted={page.config.image} />
			</div>
			<FontAwesomeIcon className={css.btn_open} icon={faPen} onClick={redirectToPage} />
		</motion.li>
	);
}
