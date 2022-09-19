import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import css from "../styles/Alert.module.css";

const Alert = ({ action, text, timeout, setAlert }) => {
	setTimeout(() => {
		setAlert(null);
	}, timeout);

	const chooseDesign = () => {
		switch (action) {
			case "success":
				return css.success;
			case "failure":
				return css.failure;
			case "alert":
				return css.alert;
		}
	};

	const chooseIcon = () => {
		switch (action) {
			case "success":
				return faCircleCheck;
			case "failure":
				return faCircleXmark;
			case "alert":
				return faCircleExclamation;
		}
	};

	return (
		<div className={`${css.notifier} ${chooseDesign()}`}>
			<FontAwesomeIcon icon={chooseIcon()} />
			<label>{`${text}`}</label>
		</div>
	);
};

export default Alert;
