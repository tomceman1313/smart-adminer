/* eslint-disable react-hooks/exhaustive-deps */
import { faArrowDown, faArrowUp, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

import css from "../styles/Product.module.css";

const Variant = ({ el, variants, setVariants, setParameters }) => {
	const [variantName, setVariantName] = useState(el.name);
	const [price, setPrice] = useState(el.price);
	const [inStock, setInStock] = useState(el.in_stock);

	function changeVariantName(newName) {
		const indexUpdatedVariant = variants.indexOf(el);
		const updatedVariant = JSON.parse(JSON.stringify(variants));
		updatedVariant[indexUpdatedVariant].name = newName;

		setParameters((prev) => {
			return prev.map((item) => {
				if (item.variant === variantName) {
					item.variant = newName;
				}
				return item;
			});
		});

		setVariants(updatedVariant);
		setVariantName(newName);
	}

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

	const upInOrder = () => {
		const actualPosition = el.v_order;
		if (actualPosition === 0) {
			return;
		}

		const updatedVariants = JSON.parse(JSON.stringify(variants));
		updatedVariants.map((item) => {
			if (item.v_order === actualPosition - 1) {
				item.v_order = actualPosition;
			} else if (item.v_order === actualPosition) {
				item.v_order = actualPosition - 1;
			}

			return item;
		});

		updatedVariants.sort((a, b) => a.v_order - b.v_order);
		setVariants(updatedVariants);
	};

	const downInOrder = () => {
		const actualPosition = el.v_order;
		if (actualPosition === variants.length - 1) {
			return;
		}

		const updatedVariants = JSON.parse(JSON.stringify(variants));
		updatedVariants.map((item) => {
			if (item.v_order === actualPosition + 1) {
				item.v_order = actualPosition;
			} else if (item.v_order === actualPosition) {
				item.v_order = actualPosition + 1;
			}

			return item;
		});

		updatedVariants.sort((a, b) => a.v_order - b.v_order);
		setVariants(updatedVariants);
	};

	const removeVariant = () => {
		const indexOfDeletedVariant = variants.indexOf(el);
		let updatedVariants = JSON.parse(JSON.stringify(variants));
		updatedVariants.splice(indexOfDeletedVariant, 1);

		if (indexOfDeletedVariant >= 0 && indexOfDeletedVariant !== updatedVariants.length - 1) {
			updatedVariants = updatedVariants.map((item, index) => {
				item.v_order = index;
				return item;
			});
		}
		setVariants(updatedVariants);

		setParameters((prev) => {
			const deletedParametersIndex = prev.findIndex((item) => item.variant === el.name);
			if (deletedParametersIndex >= 0) {
				prev.splice(deletedParametersIndex, 1);
			}
			return prev;
		});
	};

	return (
		<li>
			<input defaultValue={variantName} placeholder="Název" required onChange={(e) => changeVariantName(e.target.value.trim())} />
			<input defaultValue={inStock} placeholder="Skladem" required onChange={(e) => setInStock(e.target.value)} />
			<input defaultValue={price} placeholder="Cena" required onChange={(e) => setPrice(e.target.value)} />

			<div className={css.btns_cont}>
				<FontAwesomeIcon icon={faArrowDown} onClick={downInOrder} />
				<FontAwesomeIcon icon={faArrowUp} onClick={upInOrder} />
				<FontAwesomeIcon icon={faTrashCan} onClick={removeVariant} />
			</div>
		</li>
	);
};

export default Variant;
