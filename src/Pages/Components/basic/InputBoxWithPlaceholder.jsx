import React from "react";
import css from "../styles/InputBoxWithPlaceholder.module.css";

export default function InputBoxWithPlaceholder({ placeholder, type, name, register }) {
	return (
		<div className={css.input}>
			<input type={type} {...register(name)} required />
			<label>{placeholder}</label>
		</div>
	);
}
