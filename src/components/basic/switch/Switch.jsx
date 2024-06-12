import css from "./Switch.module.css";

export default function Switch({ register, label, name, defaultValue }) {
	return (
		<div>
			<p>{label}</p>
			<label className={css.switch}>
				<input
					type="checkbox"
					{...register(name)}
					defaultChecked={defaultValue ? defaultValue : false}
				/>
				<span data-testid="switch" className={css.slider}></span>
			</label>
		</div>
	);
}
