import cssBasic from "../styles/Basic.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InputBox = ({ placeholder, register, type, name, icon, white, isRequired, accept, additionalClasses, defaultValue, readOnly, title }) => {
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
		<div className={divClassName} title={title ? title : null}>
			<input
				type={type ? type : "text"}
				defaultValue={defaultValue}
				placeholder={placeholder}
				{...register(name)}
				required={isRequired && true}
				accept={accept}
				readOnly={readOnly}
				pattern="\S(.*\S)?"
			/>
			<FontAwesomeIcon className={`${cssBasic.icon}`} icon={icon} />
		</div>
	);
};

export default InputBox;
