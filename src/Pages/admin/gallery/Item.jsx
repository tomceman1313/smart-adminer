import { useState } from "react";
import { faPencil, faFloppyDisk, faTrashCan, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import useInteraction from "../../Hooks/useInteraction";

const Item = ({ el, remove, edit, show }) => {
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
	};

	const removeCategory = () => {
		setAlert({
			id: el.id,
			question: "Opravdu si přejete odstranit kategorii?",
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
