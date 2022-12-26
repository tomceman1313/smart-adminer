import cssBasic from "../../admin/styles/Basic.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const InputBox = ({ placeholder, register, type, name, icon, white }) => {
	let divClassName = `${cssBasic.input_box}`;
	if (white) {
		divClassName = `${cssBasic.input_box} ${cssBasic.white_color}`;
	}

	return (
		<div className={divClassName}>
			<input type={type} placeholder={placeholder} {...register(name)} autoComplete="new-password" />
			<FontAwesomeIcon className={`${cssBasic.icon} ${cssBasic.white_color}`} icon={icon} />
		</div>
	);
};

export default InputBox;
