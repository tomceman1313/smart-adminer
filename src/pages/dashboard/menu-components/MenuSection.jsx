import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import css from "./MenuComponents.module.css";

export default function MenuSection({ children, title, name, icon, activeSection, openMenuSection, redirectLocation }) {
	return (
		<li className={activeSection === name ? `${css.active} ${css.menu_section}` : css.menu_section} onClick={() => openMenuSection(name)}>
			<div>
				<FontAwesomeIcon className={css.icon} icon={icon} />
				{redirectLocation ? (
					<Link to={redirectLocation} className={css.section_title}>
						{title}
					</Link>
				) : (
					<label className={css.section_title}>{title}</label>
				)}
				<FontAwesomeIcon className={css.smallarrow} icon={faChevronDown} onClick={() => openMenuSection(name)} />
			</div>

			<article>{children}</article>
		</li>
	);
}
