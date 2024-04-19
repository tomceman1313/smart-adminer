import { publicPath } from "../../../modules/BasicFunctions";

import Menu from "../menu-components/Menu";
import css from "./DesktopMenu.module.css";

export default function DesktopMenu({ permissions, logOut }) {
	return (
		<div className={css.menu}>
			<div className={css.logo_cont}>
				<img src={`${publicPath}/favicon.svg`} className={css.logo} alt="logo" />
				<img src={`${publicPath}/logo-white.svg`} className={css.logo_text} alt="logo" />
			</div>
			<ul>
				<Menu permissions={permissions} logOut={logOut} />
			</ul>
		</div>
	);
}
