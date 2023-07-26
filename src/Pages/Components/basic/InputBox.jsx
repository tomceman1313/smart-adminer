import cssBasic from "../../admin/styles/Basic.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InputBox = ({ placeholder, register, type, name, icon, white, isRequired, accept, additionalClasses }) => {
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
		<div className={divClassName}>
			<input type={type} placeholder={placeholder} {...register(name)} autoComplete="new-password" required={isRequired && true} accept={accept} />
			<FontAwesomeIcon className={`${cssBasic.icon}`} icon={icon} />
		</div>
	);
};

export default InputBox;
