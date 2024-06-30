import {
	faEye,
	faFloppyDisk,
	faPencil,
	faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import useInteraction from "../../../hooks/useInteraction";
import css from "./Item.module.css";
import { useTranslation } from "react-i18next";

export default function Item({ el, remove, edit, show, deleteQuestion }) {
	const { t } = useTranslation("categoriesC");
	const { setAlert } = useInteraction();
	const [disabled, setDisabled] = useState(true);
	const inputRef = useRef(null);

	async function changeHandler() {
		if (!disabled) {
			if (el.name !== inputRef.current.value) {
				await edit({ id: el.id, name: inputRef.current.value });
			}
		}
		setDisabled((prev) => !prev);
		setTimeout(() => {
			inputRef.current.focus();
		}, 500);
	}

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
			<input
				defaultValue={el.name}
				disabled={disabled}
				required
				ref={inputRef}
			/>
			{show ? (
				<FontAwesomeIcon
					className={css.filter_button}
					icon={faEye}
					title={t("titleFilterButton")}
					onClick={filterByItemId}
				/>
			) : null}
			<FontAwesomeIcon
				className={css.edit_button}
				icon={disabled ? faPencil : faFloppyDisk}
				title={t("titleEditButton")}
				onClick={changeHandler}
			/>
			<FontAwesomeIcon
				className={css.delete_button}
				icon={faTrashCan}
				title={t("titleDeleteButton")}
				onClick={removeItem}
			/>
		</li>
	);
}
