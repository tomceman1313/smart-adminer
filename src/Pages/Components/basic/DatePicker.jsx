import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import css from "../styles/DatePicker.module.css";

export default function DatePicker({ placeholder, defaultValue, register, name, icon, isRequired, white, additionalClasses, title }) {
	let divClassName = `${css.input_box}`;
	if (white) {
		divClassName = `${css.input_box} ${css.white_color}`;
	}

	if (additionalClasses) {
		if (additionalClasses.includes("half")) {
			divClassName += ` ${css.half}`;
		}

		if (additionalClasses.includes("blue")) {
			divClassName += ` ${css.blue}`;
		}

		if (additionalClasses.includes("green")) {
			divClassName += ` ${css.green}`;
		}

		if (additionalClasses.includes("gray")) {
			divClassName += ` ${css.gray}`;
		}
	}

	return (
		<div className={divClassName} title={title ? title : ""}>
			<input type="date" defaultValue={defaultValue ? defaultValue : ""} {...register(name)} required={isRequired && true} />
			<label>{placeholder}</label>
			<FontAwesomeIcon className={`${css.icon}`} icon={icon ? icon : faCalendarWeek} />
		</div>
	);
}
