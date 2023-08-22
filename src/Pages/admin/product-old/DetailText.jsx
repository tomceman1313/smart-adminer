import React from "react";
import TextEditor from "../../Components/admin/TextEditor";

import css from "./Product.module.css";

export default function DetailText({ detailText, setDetailText }) {
	return (
		<section className={css.detail}>
			<h2>Detailní popis</h2>
			<TextEditor value={detailText} setValue={setDetailText} />
		</section>
	);
}
