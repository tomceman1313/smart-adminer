import css from "./Switch.module.css";

export default function Switch({ register, label, name }) {
	return (
		<div>
			<p>{label}</p>
			<label className={css.switch}>
				<input type="checkbox" {...register(name)} />
				<span className={css.slider}></span>
			</label>
		</div>
	);
}
