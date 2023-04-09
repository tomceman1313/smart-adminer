import { useState } from "react";
import { faPencil, faFloppyDisk, faTrashCan, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";

import css from "./Product.module.css";

const Variant = ({ el, variants, setVariants }) => {
	const [disabled, setDisabled] = useState(true);
	const refName = useRef(null);
	const refPrice = useRef(null);
	const refInStock = useRef(null);

	const changeHandler = () => {
		if (!disabled) {
			const pos = variants.map((e) => e.name).indexOf(el.name);
			if (pos >= 0) {
				let changedArray = [...variants];
				changedArray[pos].name = refName.current.value;
				setVariants(changedArray);
			}
		} else {
			setTimeout(() => {
				refName.current.focus();
			}, 500);
		}
		setDisabled((prev) => !prev);
	};

	const upInOrder = () => {
		const actualPosition = el.v_order;
		if (actualPosition === 0) {
			return;
		}
		const updatedPositions = variants.map((item) => {
			if (item.v_order === actualPosition - 1) {
				item.v_order = actualPosition;
			} else if (item.v_order === actualPosition) {
				item.v_order = actualPosition - 1;
			}

			return item;
		});
		const sorted = updatedPositions.sort((a, b) => a.v_order - b.v_order);
		setVariants(sorted);
	};

	const downInOrder = () => {
		const actualPosition = el.v_order;
		if (actualPosition === variants.length - 1) {
			return;
		}
		const updatedPositions = variants.map((item) => {
			if (item.v_order === actualPosition + 1) {
				item.v_order = actualPosition;
			} else if (item.v_order === actualPosition) {
				item.v_order = actualPosition + 1;
			}

			return item;
		});
		const sorted = updatedPositions.sort((a, b) => a.v_order - b.v_order);
		setVariants(sorted);
	};

	const removeCategory = () => {
		const pos = variants.map((e) => e.name).indexOf(refName.current.value);
		if (pos >= 0) {
			const reducedArray = [...variants];
			reducedArray.splice(pos, 1);

			for (let index = 0; index < reducedArray.length; index++) {
				reducedArray[index].v_order = index;
			}
			setVariants(reducedArray);
		}
	};

	return (
		<li>
			<input defaultValue={el.name} placeholder="Název" disabled={disabled} required ref={refName} />
			<input defaultValue={el.in_stock} placeholder="Skladem" disabled={disabled} required ref={refInStock} />
			<input defaultValue={el.price} placeholder="Cena" disabled={disabled} required ref={refPrice} />

			<div className={css.btns_cont}>
				<FontAwesomeIcon icon={faArrowDown} onClick={downInOrder} />
				<FontAwesomeIcon icon={faArrowUp} onClick={upInOrder} />
				<FontAwesomeIcon icon={disabled ? faPencil : faFloppyDisk} onClick={changeHandler} />
				<FontAwesomeIcon icon={faTrashCan} onClick={removeCategory} />
			</div>
		</li>
	);
};

export default Variant;
