import { useRef } from "react";
import useInteraction from "../../hooks/useInteraction";

import Variant from "./inner-components/Variant";
import css from "./styles/Product.module.css";
import { useTranslation } from "react-i18next";

export default function Variants({ variants, setVariants, parameters, setParameters }) {
	const { t } = useTranslation("products");
	const { setMessage } = useInteraction();

	const refName = useRef(null);
	const refPrice = useRef(null);
	const refInStock = useRef(null);

	const addVariant = () => {
		const variantAdded = [
			...variants,
			{
				name: refName.current.value,
				price: refPrice.current.value,
				in_stock: refInStock.current.value,
				v_order: variants.length,
				id: variants.length,
			},
		];
		if (variants.filter((item) => item.name === refName.current.value).length > 0) {
			setMessage({ action: "alert", text: t("messageVariantNameIsTaken") });
			refName.current.value = "";
			refName.current.focus();
			return;
		}

		if (refInStock.current.value === "") {
			setMessage({ action: "alert", text: t("messageNoPiecesDefined") });
			refInStock.current.focus();
			return;
		}

		if (refPrice.current.value === "") {
			setMessage({ action: "alert", text: t("messageNoPrice") });
			refPrice.current.focus();
			return;
		}

		let parametersUpdated = [...parameters, { variant: refName.current.value, params: [] }];
		setParameters(parametersUpdated);

		refName.current.value = "";
		refPrice.current.value = "";
		refInStock.current.value = "";
		setVariants(variantAdded.sort((a, b) => a.v_order - b.v_order));
	};

	return (
		<section className={css.variants}>
			<h2>{t("headerVariants")}</h2>
			<ul>
				{variants.length > 0 && (
					<li className={css.table_head}>
						<label>{t("tableHeadName")}</label>
						<label>{t("tableHeadInStock")}</label>
						<label>{t("tableHeadPrice")}</label>
						<label></label>
					</li>
				)}
				{variants.length > 0 ? (
					variants.map((item) => (
						<Variant key={`var-${item.id}-${item.v_order}`} el={item} variants={variants} setVariants={setVariants} setParameters={setParameters} />
					))
				) : (
					<p>{t("noVariantsFound")}</p>
				)}
			</ul>
			<h3>{t("headerAddVariant")}</h3>
			<div>
				<input type="text" placeholder={t("tableHeadName")} ref={refName} />
				<input type="number" placeholder={t("tableHeadInStock")} ref={refInStock} />
				<input type="number" placeholder={t("tableHeadPrice")} ref={refPrice} />

				<button type="button" onClick={addVariant}>
					{t("buttonAdd")}
				</button>
			</div>
		</section>
	);
}
