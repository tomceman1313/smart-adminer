import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PlusButton({ onClick }) {
	return (
		<div className="plus_button" onClick={onClick}>
			<FontAwesomeIcon icon={faPlus} />
		</div>
	);
}
