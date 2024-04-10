import { faEye, faFloppyDisk, faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import useInteraction from "../../../hooks/useInteraction";

import css from "./Item.module.css";

export default function Item({ el, remove, edit, show, deleteQuestion }) {
	const [disabled, setDisabled] = useState(true);
	const inputRef = useRef(null);
	const { setAlert } = useInteraction();

	const changeHandler = () => {
		if (!disabled) {
			if (el.name !== inputRef.current.value) {
				edit({ id: el.id, name: inputRef.current.value });
			}
		}
		setDisabled((prev) => !prev);
		setTimeout(() => {
			inputRef.current.focus();
		}, 500);
	};

	const removeItem = () => {
		setAlert({
			id: el.id,
			question: deleteQuestion,
			positiveHandler: remove,
		});
	};

	const filterByItemId = () => {
		show(el.id);
	};

	return (
		<li className={css.item}>
			<input defaultValue={el.name} disabled={disabled} required ref={inputRef} />
			{show ? <FontAwesomeIcon className={css.filter_button} icon={faEye} onClick={filterByItemId} /> : <></>}
			<FontAwesomeIcon className={css.edit_button} icon={disabled ? faPencil : faFloppyDisk} onClick={changeHandler} />
			<FontAwesomeIcon className={css.delete_button} icon={faTrashCan} onClick={removeItem} />
		</li>
	);
}
