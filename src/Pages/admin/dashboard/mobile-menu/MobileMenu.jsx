import { AnimatePresence, motion, useCycle } from "framer-motion";
import { publicPath } from "../../../modules/BasicFunctions";
import Menu from "../menu-components/Menu";
import { MenuToggle } from "./MenuToggle";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

import css from "./MobileMenu.module.css";

const MobileMenu = ({ logOut }) => {
	const location = useLocation();
	const [isOpen, toggleOpen] = useCycle(false, true);

	useEffect(() => {
		if (isOpen) toggleOpen();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	return (
		<motion.div className={css.menu} initial={false} animate={isOpen ? "open" : "closed"}>
			<div className={css.logo_title}>
				<img src={`${publicPath}/images/logo512.png`} alt="logo" />
				<label className={css.title}>Adminer Mobile</label>
			</div>
			<MenuToggle toggle={() => toggleOpen()} css={css} />
			<AnimatePresence>
				{isOpen && (
					<motion.ul initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", bounce: 0 }}>
						<Menu logOut={logOut} />
					</motion.ul>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default MobileMenu;
