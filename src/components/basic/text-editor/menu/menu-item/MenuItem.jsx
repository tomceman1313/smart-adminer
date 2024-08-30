import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import css from "./MenuItem.module.css";

export default function MenuItem({
	icon,
	title,
	label,
	onClick,
	className,
	disabled,
	style,
	whiteMode,
}) {
	return (
		<li
			title={title}
			onClick={onClick}
			disabled={disabled}
			className={`${css.menu_item} ${className} ${whiteMode ? css.white : ""}`}
		>
			<FontAwesomeIcon icon={icon} style={style} />
			{label && <label>{label}</label>}
		</li>
	);
}
