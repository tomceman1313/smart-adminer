import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import ConfigSettingValue from "./ConfigSettingValue";

import css from "./Pages.module.css";

export default function Page({ page, redirectToPage }) {
	return (
		<li className={css.page}>
			<div className={css.info}>
				<b>{page.name}</b>
				<label>{page.info}</label>
			</div>
			<div className={css.page_configs}>
				<ConfigSettingValue name="Nadpis" isPermitted={page.config.title} />
				<ConfigSettingValue name="Popisek" isPermitted={page.config.description} />
				<ConfigSettingValue name="Rozšířený editor" isPermitted={page.config.rich_editor} />
				<ConfigSettingValue name="Obrázek" isPermitted={page.config.image} />
			</div>
			<FontAwesomeIcon className={css.btn_open} icon={faPen} onClick={redirectToPage} />
		</li>
	);
}
