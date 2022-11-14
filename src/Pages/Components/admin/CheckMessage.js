import React from "react";
import css from "../styles/CheckMessage.module.css";

const CheckMessage = ({ id, question, positiveHandler, setCheck }) => {
	const hideCheckMessage = () => {
		setCheck(null);
	};

	return (
		<div className={css.check_message}>
			<p>{question}</p>
			<p>{id}</p>
			<button
				onClick={() => {
					positiveHandler(id);
					setCheck(null);
				}}
			>
				Potvrdit
			</button>
			<button onClick={hideCheckMessage}>Zrušit</button>
		</div>
	);
};

export default CheckMessage;
