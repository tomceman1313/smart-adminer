import css from "./CheckMark.module.css";

export default function CheckMark() {
	return (
		<div className={css.wrapper}>
			<svg className={css.animated_check} viewBox="0 0 24 24">
				<path d="M4.1 12.7L9 17.6 20.3 6.3" fill="none" />{" "}
			</svg>
		</div>
	);
}
