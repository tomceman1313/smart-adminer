import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormContext } from "react-hook-form";
import css from "./TextArea.module.css";

export default function TextArea({
	placeholder,
	name,
	icon,
	white,
	isRequired,
	additionalClasses,
	defaultValue,
	readOnly,
}) {
	const {
		register,
		formState: { errors },
	} = useFormContext();

	let divClassName = `${css.input_box}`;
	if (white) {
		divClassName = `${css.input_box} ${css.white_color}`;
	}

	if (errors[name]) {
		divClassName += ` ${css.validationError}`;
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
			{errors[name] && (
				<p
					className={css.error_message}
					title={`* ${errors[name].message}`}
				>{`* ${errors[name].message}`}</p>
			)}
		</div>
	);
}
