/* eslint-disable react-hooks/exhaustive-deps */
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";

import { useTranslation } from "react-i18next";
import { DragHandle } from "../../../components/common/sortable/DragHandle";
import css from "../styles/Product.module.css";

const Variant = ({ el, variants, setVariants, setParameters }) => {
	const { t } = useTranslation("products");

	const [variantName, setVariantName] = useState(el.name);
	const debounceName = useDebounce(variantName);

	const [price, setPrice] = useState(el.price);
	const [inStock, setInStock] = useState(el.in_stock);

	useEffect(() => {
		const indexUpdatedVariant = variants.indexOf(el);
		const updatedVariant = JSON.parse(JSON.stringify(variants));
		updatedVariant[indexUpdatedVariant].name = debounceName;

		setParameters((prev) => {
			return prev.map((item) => {
				if (item.variant === el.name) {
					item.variant = debounceName;
				}
				return item;
			});
		});

		setVariants(updatedVariant);
		setVariantName(debounceName);
	}, [debounceName]);

	useEffect(() => {
		const indexUpdatedVariant = variants.indexOf(el);
		const updatedVariant = JSON.parse(JSON.stringify(variants));
		updatedVariant[indexUpdatedVariant].price = price;
		setVariants(updatedVariant);
	}, [price]);

	useEffect(() => {
		const indexUpdatedVariant = variants.indexOf(el);
		const updatedVariant = JSON.parse(JSON.stringify(variants));
		updatedVariant[indexUpdatedVariant].in_stock = inStock;
		setVariants(updatedVariant);
	}, [inStock]);

	const removeVariant = () => {
		const indexOfDeletedVariant = variants.indexOf(el);
		let updatedVariants = JSON.parse(JSON.stringify(variants));
		updatedVariants.splice(indexOfDeletedVariant, 1);

		if (
			indexOfDeletedVariant >= 0 &&
			indexOfDeletedVariant !== updatedVariants.length - 1
		) {
			updatedVariants = updatedVariants.map((item, index) => {
				item.v_order = index;
				return item;
			});
		}
		setVariants(updatedVariants);

		setParameters((prev) => {
			const deletedParametersIndex = prev.findIndex(
				(item) => item.variant === el.name
			);
			if (deletedParametersIndex >= 0) {
				prev.splice(deletedParametersIndex, 1);
			}
			return prev;
		});
	};

	return (
		<>
			<input
				defaultValue={variantName}
				placeholder={t("placeholderTitle")}
				required
				onChange={(e) => setVariantName(e.target.value.trim())}
			/>
			<input
				defaultValue={inStock}
				placeholder={t("placeholderInStock")}
				required
				onChange={(e) => setInStock(e.target.value)}
			/>
			<input
				defaultValue={price}
				placeholder={t("placeholderOnePiecePrice")}
				required
				onChange={(e) => setPrice(e.target.value)}
			/>

			<div className={css.btns_cont}>
				{/* <FontAwesomeIcon icon={faArrowDown} onClick={downInOrder} />
				<FontAwesomeIcon icon={faArrowUp} onClick={upInOrder} /> */}
				<FontAwesomeIcon
					className={css.trash_btn}
					icon={faTrashCan}
					onClick={removeVariant}
				/>
				<DragHandle id={el.id} />
			</div>
		</>
	);
};

export default Variant;
