import React from "react";
import TextEditor from "../../components/admin/TextEditor";

import css from "./styles/Product.module.css";
import { useTranslation } from "react-i18next";

export default function DetailText({ detailText, setDetailText }) {
	const { t } = useTranslation("products");

	return (
		<section className={css.detail}>
			<h2>{t("headerDetailText")}</h2>
			<TextEditor value={detailText} setValue={setDetailText} />
		</section>
	);
}
