import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MenuBarButton({
	icon,
	label,
	onClick,
	className,
	disabled,
	style,
}) {
	return (
		<span
			title={label}
			onClick={onClick}
			disabled={disabled}
			className={className}
		>
			<FontAwesomeIcon icon={icon} style={style} />
		</span>
	);
}
