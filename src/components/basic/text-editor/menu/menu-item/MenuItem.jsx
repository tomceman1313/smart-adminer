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
	children,
}) {
	return (
		<li
			title={title}
			onClick={onClick}
			disabled={disabled}
			className={`${css.menu_item} ${className} ${whiteMode ? css.white : ""}`}
		>
			{children ? (
				children
			) : (
				<FontAwesomeIcon icon={icon} style={style} className={css.icon} />
			)}
			{label && <label>{label}</label>}
		</li>
	);
}
