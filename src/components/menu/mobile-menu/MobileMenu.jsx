import { AnimatePresence, motion, useCycle } from "framer-motion";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Menu from "../menu-components/Menu";
import { MenuToggle } from "./MenuToggle";
import css from "./MobileMenu.module.css";

const MobileMenu = ({ permissions, logOut }) => {
	const location = useLocation();
	const [isOpen, toggleOpen] = useCycle(false, true);

	useEffect(() => {
		if (isOpen) toggleOpen();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	return (
		<motion.div
			className={css.menu}
			initial={false}
			animate={isOpen ? "open" : "closed"}
		>
			<Link to="/">
				<div className={css.logo_title}>
					<img src={`/admin/favicon.svg`} className={css.logo} alt="logo" />
					<img
						src={`/admin/logo-white.svg`}
						className={css.logo_text}
						alt="logo"
					/>
				</div>
			</Link>
			<MenuToggle toggle={() => toggleOpen()} css={css} />
			<AnimatePresence>
				{isOpen && (
					<motion.ul
						initial={{ x: "-100%" }}
						animate={{ x: 0 }}
						exit={{ x: "-100%" }}
						transition={{ type: "spring", bounce: 0 }}
					>
						<Menu permissions={permissions} logOut={logOut} />
					</motion.ul>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default MobileMenu;
