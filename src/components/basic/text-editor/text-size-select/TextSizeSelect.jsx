import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import Options from "./Options";
import css from "./TextSizeSelect.module.css";

export default function TextSizeSelect({ editor, whiteMode }) {
	const selectRef = useRef(null);
	const [selectedOption, setSelectedOption] = useState(getDefaultValue());
	const [selectRect, setSelectRect] = useState(false);

	function toggleOptions() {
		if (selectRect) {
			setSelectRect(null);
			return;
		}
		const coordinates = selectRef.current.getBoundingClientRect();
		setSelectRect({
			top: coordinates.top,
			left: coordinates.left,
			right: coordinates.right,
			bottom: coordinates.bottom,
			width: coordinates.width,
		});
	}

	function setActiveOption(option) {
		setSelectedOption(option);
		setSelectRect(null);
	}

	function getDefaultValue() {
		if (editor.isActive("paragraph") === "is-active") return "p";
		if (editor.isActive("heading", { level: 1 }) === "is-active") return "h1";
		if (editor.isActive("heading", { level: 2 }) === "is-active") return "h2";
		if (editor.isActive("heading", { level: 3 }) === "is-active") return "h3";
		if (editor.isActive("heading", { level: 4 }) === "is-active") return "h4";

		return "Text";
	}

	return (
		<div className={`${css.select_cont} ${whiteMode ? css.white : ""}`}>
			<div ref={selectRef} className={`${css.select}`} onClick={toggleOptions}>
				<div>
					<p>{selectedOption?.name ? selectedOption.name : selectedOption}</p>
				</div>

				<FontAwesomeIcon icon={faChevronDown} className={css.arrow} />
			</div>
			{selectRect && (
				<Options
					editor={editor}
					selectRect={selectRect}
					setActiveOption={setActiveOption}
				/>
			)}
		</div>
	);
}
