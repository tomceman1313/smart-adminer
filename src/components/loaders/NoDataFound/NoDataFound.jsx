import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import css from "./NotFound.module.css";

export default function NoDataFound({ text }) {
	return (
		<section className={`${css.not_found} no-section`}>
			<FontAwesomeIcon icon={faMagnifyingGlass} />
			<b>{text}</b>
		</section>
	);
}
