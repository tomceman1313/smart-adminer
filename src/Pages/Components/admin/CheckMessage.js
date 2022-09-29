import React from "react";
import css from "../styles/CheckMessage.module.css";

const CheckMessage = ({ question, positiveHandler }) => {
	return (
		<div className={css.check_message}>
			<p>{question}</p>
			<button onClick={positiveHandler}>Potvrdit</button>
			<button>Zrušit</button>
		</div>
	);
};

export default CheckMessage;
