import { faEye, faFloppyDisk, faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import useInteraction from "../../Hooks/useInteraction";

const Item = ({ el, remove, edit, show, deleteQuestion }) => {
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

	const removeCategory = () => {
		setAlert({
			id: el.id,
			question: deleteQuestion ? deleteQuestion : "Opravdu si přejete odstranit kategorii?",
			positiveHandler: remove,
		});
	};

	const showCategory = () => {
		show(el.id);
	};

	return (
		<li>
			<input defaultValue={el.name} disabled={disabled} required ref={inputRef} />
			<FontAwesomeIcon icon={faEye} onClick={showCategory} />
			<FontAwesomeIcon icon={disabled ? faPencil : faFloppyDisk} onClick={changeHandler} />
			<FontAwesomeIcon icon={faTrashCan} onClick={removeCategory} />
		</li>
	);
};

export default Item;
