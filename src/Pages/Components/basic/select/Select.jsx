import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import cssBasic from "../../../admin/styles/Basic.module.css";

export default function Select({ register, name, icon, options, defaultValue, placeholderValue }) {
	return (
		<div className={cssBasic.input_box}>
			<select {...register(name)} defaultValue={defaultValue ? defaultValue : ""} required>
				{placeholderValue && (
					<option value="" disabled>
						{placeholderValue}
					</option>
				)}
				{options &&
					options.map((el) => (
						<option key={`${name}-${el.name}`} value={el.id ? el.id : el.value}>
							{el.name}
						</option>
					))}
			</select>
			<FontAwesomeIcon className={cssBasic.icon} icon={icon} />
		</div>
	);
}
