import { useRef } from "react";
import { useTranslation } from "react-i18next";
import SortableItem from "../../components/common/sortable/SortableItem";
import SortableList from "../../components/common/sortable/SortableList";
import useInteraction from "../../hooks/useInteraction";
import Variant from "./inner-components/Variant";
import css from "./styles/Product.module.css";

export default function Variants({
	variants,
	setVariants,
	parameters,
	setParameters,
}) {
	const { t } = useTranslation("products");
	const { setMessage } = useInteraction();

	const refName = useRef(null);
	const refPrice = useRef(null);
	const refInStock = useRef(null);

	const addVariant = () => {
		//give new variant provisional id based on the greatest of existing
		const provisionalId =
			variants.reduce((max, obj) => {
				return obj.id > max ? obj.id : max;
			}, variants[0].id) + 1;

		const variantAdded = [
			...variants,
			{
				id: provisionalId,
				name: refName.current.value,
				price: refPrice.current.value,
				in_stock: refInStock.current.value,
				v_order: variants.length,
			},
		];
		if (
			variants.filter((item) => item.name === refName.current.value).length > 0
		) {
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

		let parametersUpdated = [
			...parameters,
			{ variant: refName.current.value, params: [] },
		];
		setParameters(parametersUpdated);

		refName.current.value = "";
		refPrice.current.value = "";
		refInStock.current.value = "";
		setVariants(variantAdded.sort((a, b) => a.v_order - b.v_order));
	};

	function orderVariantsHandler(orderedVariants) {
		const newOrder = variants.map((variant, index) => {
			return { ...variant, v_order: index };
		});
		console.log(newOrder);
		//setVariants(newOrder);
	}

	return (
		<section className={`${css.variants} half-section`}>
			<h2>{t("headerVariants")}</h2>
			{variants.length > 0 && (
				<li className={css.table_head}>
					<label>{t("tableHeadName")}</label>
					<label>{t("tableHeadInStock")}</label>
					<label>{t("tableHeadPrice")}</label>
					<label></label>
				</li>
			)}
			<SortableList
				items={variants}
				setState={setVariants}
				overlayElement={OverlayVariant}
				sortCallbackFunction={orderVariantsHandler}
			>
				<ul>
					{variants.length > 0 ? (
						variants.map((item) => (
							<SortableItem
								key={`var-${item.id}-${item.v_order}`}
								item={item}
								className={css.variant}
							>
								<Variant
									el={item}
									variants={variants}
									setVariants={setVariants}
									setParameters={setParameters}
								/>
							</SortableItem>
						))
					) : (
						<p>{t("noVariantsFound")}</p>
					)}
				</ul>
			</SortableList>
			<h3>{t("headerAddVariant")}</h3>
			<div className={css.new_variant}>
				<input type="text" placeholder={t("tableHeadName")} ref={refName} />
				<input
					type="number"
					placeholder={t("tableHeadInStock")}
					ref={refInStock}
				/>
				<input type="number" placeholder={t("tableHeadPrice")} ref={refPrice} />

				<button type="button" onClick={addVariant}>
					{t("buttonAdd")}
				</button>
			</div>
		</section>
	);
}

function OverlayVariant(variant, variants) {
	return (
		<li className={css.variant}>
			<Variant
				el={variant}
				variants={variants}
				setVariants={() => {}}
				setParameters={() => {}}
			/>
		</li>
	);
}
