import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormContext } from "react-hook-form";
import css from "../styles/DatePicker.module.css";

export default function DatePicker({
	placeholder,
	defaultValue,
	name,
	icon,
	isRequired,
	white,
	additionalClasses,
	title,
}) {
	const {
		register,
		formState: { errors },
	} = useFormContext();

	let divClassName = `${css.input_box}`;
	if (white) {
		divClassName += ` ${css.white_color}`;
	}

	if (errors[name]) {
		divClassName += ` ${css.validationError}`;
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
			<input
				type="date"
				defaultValue={defaultValue ? defaultValue : ""}
				{...register(name)}
				required={isRequired && true}
			/>
			<label>{placeholder}</label>
			<FontAwesomeIcon
				className={`${css.icon}`}
				icon={icon ? icon : faCalendarWeek}
			/>
			{errors[name] && (
				<p
					className={css.error_message}
					title={`* ${errors[name].message}`}
				>{`* ${errors[name].message}`}</p>
			)}
		</div>
	);
}
