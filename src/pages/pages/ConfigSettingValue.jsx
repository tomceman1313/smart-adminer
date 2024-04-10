import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default function ConfigSettingValue({ name, isPermitted }) {
	return (
		<div>
			<label>{name}</label>
			{isPermitted ? (
				<FontAwesomeIcon icon={faCircleCheck} style={{ color: "var(--green)" }} />
			) : (
				<FontAwesomeIcon icon={faCircleXmark} style={{ color: "var(--red)" }} />
			)}
		</div>
	);
}
