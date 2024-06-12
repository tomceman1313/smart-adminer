import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormContext } from "react-hook-form";
import cssBasic from "../styles/Basic.module.css";

const InputBox = ({
	placeholder,
	type,
	name,
	icon,
	white,
	isRequired,
	accept,
	additionalClasses,
	defaultValue,
	readOnly,
	title,
	multiple,
}) => {
	const {
		register,
		formState: { errors },
	} = useFormContext();

	let divClassName = `${cssBasic.input_box}`;
	if (white) {
		divClassName = `${cssBasic.input_box} ${cssBasic.white_color}`;
	}

	if (additionalClasses) {
		if (additionalClasses.includes("half")) {
			divClassName += ` ${cssBasic.half}`;
		}
	}

	return (
		<>
			<div className={divClassName} title={title ? title : null}>
				<input
					type={type ? type : "text"}
					defaultValue={defaultValue}
					placeholder={placeholder}
					{...register(name)}
					required={isRequired && true}
					accept={accept}
					readOnly={readOnly}
					multiple={multiple}
					pattern="\S(.*\S)?"
				/>
				<FontAwesomeIcon className={`${cssBasic.icon}`} icon={icon} />
			</div>
			{errors[name] && (
				<p
					style={{ color: "var(--red)", marginTop: "-15px" }}
				>{`* ${errors[name].message}`}</p>
			)}
		</>
	);
};

export default InputBox;
