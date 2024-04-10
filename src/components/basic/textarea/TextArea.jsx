import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import css from "./TextArea.module.css";

export default function TextArea({ placeholder, register, type, name, icon, white, isRequired, additionalClasses, defaultValue, readOnly }) {
	let divClassName = `${css.input_box}`;
	if (white) {
		divClassName = `${css.input_box} ${css.white_color}`;
	}

	if (additionalClasses) {
		if (additionalClasses.includes("half")) {
			divClassName += ` ${css.half}`;
		}
	}

	return (
		<div className={divClassName}>
			<FontAwesomeIcon className={`${css.icon}`} icon={icon} />
			<textarea
				placeholder={placeholder}
				{...register(name)}
				required={isRequired && true}
				readOnly={readOnly}
				pattern="\S(.*\S)?"
				defaultValue={defaultValue}
			></textarea>
		</div>
	);
}
