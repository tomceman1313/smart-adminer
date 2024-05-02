import CheckMark from "../checkmark/CheckMark";
import Spinner from "../spinner/Spinner";
import css from "./SubmitButton.module.css";

export default function SubmitButton({ status, value, additionalCss }) {
	return (
		<button
			className={`${css.btn} ${additionalCss ? additionalCss : ""}`}
			disabled={status === "pending" ? true : false}
		>
			{status === "success" && <CheckMark />}
			{status === "pending" && <Spinner />}
			{value}
		</button>
	);
}
