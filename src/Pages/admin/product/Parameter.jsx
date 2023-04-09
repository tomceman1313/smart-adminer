import { useState } from "react";
import { faPencil, faFloppyDisk, faTrashCan, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";

import css from "./Product.module.css";

const Parameter = ({ el, parameters, setParameters }) => {
	const [disabled, setDisabled] = useState(true);
	const refName = useRef(null);

	const changeHandler = () => {
		if (!disabled) {
			const pos = parameters.map((e) => e.name).indexOf(el.name);
			if (pos >= 0) {
				let changedArray = [...parameters];
				changedArray[pos].name = refName.current.value;
				setParameters(changedArray);
			}
		} else {
			setTimeout(() => {
				refName.current.focus();
			}, 500);
		}

		setDisabled((prev) => !prev);
	};

	const upInOrder = () => {
		const actualPosition = el.p_order;
		if (actualPosition === 0) {
			return;
		}
		const updatedPositions = parameters.map((item) => {
			if (item.p_order === actualPosition - 1) {
				item.p_order = actualPosition;
			} else if (item.p_order === actualPosition) {
				item.p_order = actualPosition - 1;
			}

			return item;
		});
		const sorted = updatedPositions.sort((a, b) => a.p_order - b.p_order);
		setParameters(sorted);
	};

	const downInOrder = () => {
		const actualPosition = el.p_order;
		if (actualPosition === parameters.length - 1) {
			return;
		}
		const updatedPositions = parameters.map((item) => {
			if (item.p_order === actualPosition + 1) {
				item.p_order = actualPosition;
			} else if (item.p_order === actualPosition) {
				item.p_order = actualPosition + 1;
			}

			return item;
		});
		const sorted = updatedPositions.sort((a, b) => a.p_order - b.p_order);
		setParameters(sorted);
	};

	const removeParameter = () => {
		const pos = parameters.map((e) => e.name).indexOf(refName.current.value);
		if (pos >= 0) {
			const reducedArray = [...parameters];
			reducedArray.splice(pos, 1);

			for (let index = 0; index < reducedArray.length; index++) {
				reducedArray[index].p_order = index;
			}
			setParameters(reducedArray);
		}
	};

	return (
		<li>
			<input defaultValue={el.name} placeholder="Název" disabled={disabled} required ref={refName} />
			<div className={css.btns_cont}>
				<FontAwesomeIcon icon={faArrowDown} onClick={downInOrder} />
				<FontAwesomeIcon icon={faArrowUp} onClick={upInOrder} />
				<FontAwesomeIcon icon={disabled ? faPencil : faFloppyDisk} onClick={changeHandler} />
				<FontAwesomeIcon icon={faTrashCan} onClick={removeParameter} />
			</div>
		</li>
	);
};

export default Parameter;
