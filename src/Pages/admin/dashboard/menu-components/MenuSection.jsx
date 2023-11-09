import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import css from "./MenuComponents.module.css";

export default function MenuSection({ children, title, name, icon, activeSection, openMenuSection }) {
	return (
		<li className={activeSection === name ? `${css.active} ${css.menu_section}` : css.menu_section}>
			<div onClick={() => openMenuSection(name)}>
				<FontAwesomeIcon className={css.icon} icon={icon} />
				<label>{title}</label>
				<FontAwesomeIcon className={css.smallarrow} icon={faChevronDown} />
			</div>

			<article>{children}</article>
		</li>
	);
}
