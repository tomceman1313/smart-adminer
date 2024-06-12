import { useFormContext } from "react-hook-form";
import css from "./Select.module.css";
import SelectWithoutFormRef from "./SelectWithoutFormRef";

export default function Select({
	name,
	icon,
	options,
	defaultValue,
	placeholderValue,
	halfSize,
	whiteMode,
}) {
	const {
		register,
		setValue,
		formState: { errors, isSubmitSuccessful },
	} = useFormContext();

	return (
		<SelectWithoutFormRef
			defaultValue={defaultValue}
			halfSize={halfSize}
			icon={icon}
			name={name}
			setValue={setValue}
			placeholderValue={placeholderValue}
			options={options}
			whiteMode={whiteMode}
			isSubmitted={isSubmitSuccessful}
		>
			<select
				{...register(name)}
				defaultValue={defaultValue ? defaultValue : ""}
				style={{ display: "none" }}
			>
				<option value="">{placeholderValue}</option>
				{options &&
					options.map((el) => (
						<option
							key={`${name}-${el.name}-hidden`}
							value={el.id ? el.id : el.value}
						>
							{el.name}
						</option>
					))}
			</select>

			{errors[name] && (
				<p className={css.error_message}>{`* ${errors[name].message}`}</p>
			)}
		</SelectWithoutFormRef>
	);
}
