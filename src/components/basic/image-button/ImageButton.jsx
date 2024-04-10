import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ImageButton({ text, icon, className, onClick }) {
	return (
		<button className={className ? className : ""} onClick={onClick}>
			<FontAwesomeIcon icon={icon} />
			<label style={{ marginLeft: "8px" }}>{text}</label>
		</button>
	);
}
