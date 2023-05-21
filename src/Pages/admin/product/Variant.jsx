import { faArrowDown, faArrowUp, faFloppyDisk, faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";

import css from "./Product.module.css";

const Variant = ({ el, variants, setVariants, parameters, setParameters }) => {
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
				changedArray[pos].price = refPrice.current.value;
				changedArray[pos].in_stock = refInStock.current.value;
				setVariants(changedArray);
			}
		} else {
			setTimeout(() => {
				refName.current.focus();
			}, 500);
		}
		setDisabled((prev) => !prev);
	};

	/**
	 * * Function for moving variant up in the order
	 * * also swaps values in parameters
	 * @returns nothing
	 */
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
		// swap columns in parameters
		let parametersNew = updateParams();
		parameters.forEach((param, index) => {
			let paramValues = [...param.values];
			//swap values
			[paramValues[actualPosition - 1], paramValues[actualPosition]] = [paramValues[actualPosition], paramValues[actualPosition - 1]];
			parametersNew[index].values = paramValues;
		});
		setParameters(parametersNew);

		const sorted = updatedPositions.sort((a, b) => a.v_order - b.v_order);
		setVariants(sorted);
	};

	/**
	 * * Function for moving variant down in the order
	 * @returns nothing
	 */
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

		// swap columns in parameters
		let parametersNew = updateParams();
		parameters.forEach((param, index) => {
			let paramValues = [...param.values];
			//swap values
			[paramValues[actualPosition], paramValues[actualPosition + 1]] = [paramValues[actualPosition + 1], paramValues[actualPosition]];
			parametersNew[index].values = paramValues;
		});
		setParameters(parametersNew);

		const sorted = updatedPositions.sort((a, b) => a.v_order - b.v_order);
		setVariants(sorted);
	};

	/**
	 * * Function for deleting variant from variants state
	 * @returns nothing
	 */
	const removeVariant = () => {
		const pos = variants.map((e) => e.name).indexOf(refName.current.value);

		if (pos >= 0) {
			const reducedArray = [...variants];
			reducedArray.splice(pos, 1);
			//update order values
			for (let index = 0; index < reducedArray.length; index++) {
				reducedArray[index].v_order = index;
			}
			setVariants(reducedArray);
			//delete values of removed variant
			const updatedParams = parameters.map((el) => {
				el.values.splice(pos, 1);
				return el;
			});

			setParameters(updatedParams);
		}
	};

	/**
	 * * Function for update parameters values with current data
	 * ? without this default values (loaded values from server) would presist even it was changed
	 * @returns array[{name, p_order, values}]
	 */
	function updateParams() {
		//get inputs
		const inputs = document.querySelectorAll("tbody input");
		//to know how many columns one row has
		const varsCount = variants.length;

		let values = [];
		inputs.forEach((el) => {
			values.push(el.value);
		});

		let updatedParams = [...parameters];
		updatedParams.forEach((el) => {
			el.values = values.splice(0, varsCount);
		});

		return updatedParams;
	}

	return (
		<li>
			<input defaultValue={el.name} placeholder="Název" disabled={disabled} required ref={refName} />
			<input defaultValue={el.in_stock} placeholder="Skladem" disabled={disabled} required ref={refInStock} />
			<input defaultValue={el.price} placeholder="Cena" disabled={disabled} required ref={refPrice} />

			<div className={css.btns_cont}>
				<FontAwesomeIcon icon={faArrowDown} onClick={downInOrder} />
				<FontAwesomeIcon icon={faArrowUp} onClick={upInOrder} />
				<FontAwesomeIcon icon={disabled ? faPencil : faFloppyDisk} onClick={changeHandler} />
				<FontAwesomeIcon icon={faTrashCan} onClick={removeVariant} />
			</div>
		</li>
	);
};

export default Variant;
