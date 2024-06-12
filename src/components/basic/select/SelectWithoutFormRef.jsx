import { faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState, useEffect } from "react";
import cssBasic from "../../styles/Basic.module.css";
import Options from "./Options";
import css from "./Select.module.css";

export default function SelectWithoutFormRef({
	children,
	icon,
	options,
	defaultValue,
	placeholderValue,
	name,
	setValue,
	isSubmitted,
	setState,
	halfSize,
	whiteMode,
}) {
	const selectRef = useRef(null);
	const [selectedOption, setSelectedOption] = useState(
		getDefaultValue(defaultValue, placeholderValue, options)
	);
	const [selectRect, setSelectRect] = useState(false);

	useEffect(() => {
		if (isSubmitted) {
			setSelectedOption(placeholderValue);
			setSelectRect(null);
		}
	}, [isSubmitted, setSelectRect, setSelectedOption, placeholderValue]);

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
		if (typeof option === "object") {
			setSelectedOption(option.name);
		} else {
			setSelectedOption(option);
		}

		setSelectRect(null);
		//set value if register is defined
		if (setValue) {
			setValue(name, option.id ? option.id.toString() : option.value);
		} else {
			//set state when register is not defined
			setState(option);
		}
	}

	function resetField(e) {
		e.stopPropagation();
		setSelectedOption(placeholderValue);
		setSelectRect(null);

		if (setValue) {
			setValue(name, "");
		}
	}

	return (
		<div className={css.select_cont}>
			<div
				ref={selectRef}
				className={`${cssBasic.input_box} ${css.select} ${
					halfSize ? cssBasic.half : null
				} ${whiteMode ? `${css.white} ${cssBasic.white_color}` : null}`}
				onClick={toggleOptions}
			>
				<FontAwesomeIcon className={cssBasic.icon} icon={icon} />

				<div>
					<p>{selectedOption?.name ? selectedOption.name : selectedOption}</p>
				</div>

				{placeholderValue && placeholderValue !== selectedOption && (
					<FontAwesomeIcon
						icon={faXmark}
						className={css.xmark}
						onClick={resetField}
					/>
				)}

				<FontAwesomeIcon icon={faChevronDown} className={css.arrow} />
			</div>
			{children}
			{selectRect && (
				<Options
					name={name}
					options={options}
					selectRect={selectRect}
					setActiveOption={setActiveOption}
				/>
			)}
		</div>
	);
}

function getDefaultValue(value, placeholder, options) {
	//default value is not defined
	if (!value) {
		return placeholder;
	}

	//default value is number
	if (Number(value)) {
		return options.find((option) => option.id === Number(value));
	}

	//default value is object of type {name, value}
	if (options[0]?.name && options[0]?.value) {
		return options.find((option) => option.value === value);
	}

	return value;
}
