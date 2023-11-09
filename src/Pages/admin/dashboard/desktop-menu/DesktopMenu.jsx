import { publicPath } from "../../../modules/BasicFunctions";

import Menu from "../menu-components/Menu";
import css from "./DesktopMenu.module.css";

export default function DesktopMenu({ logOut }) {
	return (
		<div className={css.menu}>
			<div className={css.logo_cont}>
				<img src={`${publicPath}/images/logo512.png`} alt="logo" />
				<label className={css.title}>Adminer</label>
			</div>
			<ul>
				<Menu logOut={logOut} />
			</ul>
		</div>
	);
}
