import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import css from "./CheckBox.module.css";

export default function CheckBox({ name, checked, onChange }) {
	return (
		<div className={css.checkbox}>
			<div className={css.circle} onClick={onChange}>
				{checked && <FontAwesomeIcon icon={faCheck} />}
			</div>
			<label>{name}</label>
		</div>
	);
}
