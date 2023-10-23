import { useRef } from "react";
import { Link } from "react-router-dom";

import { faIdCard, faNewspaper } from "@fortawesome/free-regular-svg-icons";
import {
	faChevronDown,
	faDisplay,
	faGear,
	faPowerOff,
	faCalendarDays,
	faShoppingCart,
	faPeopleGroup,
	faBasketShopping,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AnimatePresence, motion, useCycle } from "framer-motion";
import { publicPath } from "../../../modules/BasicFunctions";
import { useEffect } from "react";
import { MenuToggle } from "./MenuToggle";
import css from "./MobileMenu.module.css";

const MobileMenu = ({ logOut }) => {
	const activeMenu = useRef(null);
	const activeMenuItem = useRef(null);

	const [isOpen, toggleOpen] = useCycle(false, true);

	useEffect(() => {
		if (isOpen && activeMenu.current !== null) {
			document.getElementById(activeMenu.current).parentNode.classList.add(css.active);
			if (activeMenuItem.current !== null) {
				document.getElementById(activeMenuItem.current).classList.add(css.active_link);
			}
		}
	}, [isOpen]);

	function setActive(e) {
		let id = e.currentTarget.id;

		if (activeMenu.current === null) {
			document.getElementById(id).parentNode.classList.add(css.active);
			activeMenu.current = id;
			return;
		}

		if (id !== activeMenu.current) {
			document.getElementById(activeMenu.current).parentNode.classList.remove(css.active);
			document.getElementById(id).parentNode.classList.add(css.active);
			activeMenu.current = id;
		} else {
			document.getElementById(activeMenu.current).parentNode.classList.remove(css.active);
			activeMenu.current = null;
		}
	}

	function setActiveLink(e) {
		let id = e.currentTarget.id;
		toggleOpen();
		if (activeMenuItem.current === null) {
			document.getElementById(id).classList.add(css.active_link);
			activeMenuItem.current = id;
			return;
		}

		if (id !== activeMenuItem.current) {
			document.getElementById(activeMenuItem.current).classList.remove(css.active_link);
			document.getElementById(id).classList.add(css.active_link);
			activeMenuItem.current = id;
		}
	}

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
						<li>
							<div id="profiles" onClick={setActive}>
								<FontAwesomeIcon className={css.icon} icon={faIdCard} />
								<label>Uživatelské profily</label>
								<FontAwesomeIcon className={css.smallarrow} icon={faChevronDown} />
							</div>

							<article>
								<Link to="/users" onClick={setActiveLink} id="users">
									Seznam uživatelů
								</Link>
								<Link to="/register" onClick={setActiveLink} id="register">
									Register
								</Link>
							</article>
						</li>

						<li>
							<div id="employees" onClick={setActive}>
								<FontAwesomeIcon className={css.icon} icon={faPeopleGroup} />
								<label>Zaměstnanci</label>
								<FontAwesomeIcon className={css.smallarrow} icon={faChevronDown} />
							</div>

							<article>
								<Link to="/employees" onClick={setActiveLink} id="employees_list">
									Seznam zaměstnanců
								</Link>
								<Link to="/vacancies" onClick={setActiveLink} id="vacancies">
									Inzerované pozice
								</Link>
							</article>
						</li>

						<li>
							<div id="content" onClick={setActive}>
								<FontAwesomeIcon className={css.icon} icon={faDisplay} />
								<label>Obsah webu</label>
								<FontAwesomeIcon className={css.smallarrow} icon={faChevronDown} />
							</div>

							<article>
								<Link to="/pricelist" onClick={setActiveLink} id="pricelist">
									Ceník
								</Link>
								<Link to="/gallery" onClick={setActiveLink} id="gallery">
									Galerie
								</Link>
								<Link to="/documents" onClick={setActiveLink} id="documents">
									Dokumenty
								</Link>
								<Link to="/notifications" onClick={setActiveLink} id="notifications">
									Upozornění
								</Link>
							</article>
						</li>

						<li>
							<div id="articles" onClick={setActive}>
								<FontAwesomeIcon className={css.icon} icon={faNewspaper} />
								<label>Články</label>
								<FontAwesomeIcon className={css.smallarrow} icon={faChevronDown} />
							</div>

							<article>
								<Link to="/articles" onClick={setActiveLink} id="allArticles">
									Přehled článků
								</Link>
								<Link to="/new-article" onClick={setActiveLink} id="new-article">
									Nový článek
								</Link>
							</article>
						</li>

						<li>
							<div id="events-cont" onClick={setActive}>
								<FontAwesomeIcon className={css.icon} icon={faCalendarDays} />
								<label>Události</label>
								<FontAwesomeIcon className={css.smallarrow} icon={faChevronDown} />
							</div>

							<article>
								<Link to="/events" onClick={setActiveLink} id="events">
									Přehled událostí
								</Link>
								<Link to="/new-event" onClick={setActiveLink} id="new-event">
									Nová událost
								</Link>
							</article>
						</li>

						<li>
							<div id="products-cont" onClick={setActive}>
								<FontAwesomeIcon className={css.icon} icon={faShoppingCart} />
								<label>Produkty</label>
								<FontAwesomeIcon className={css.smallarrow} icon={faChevronDown} />
							</div>

							<article>
								<Link to="/products" onClick={setActiveLink} id="products">
									Přehled produktů
								</Link>
								<Link to="/new-product" onClick={setActiveLink} id="new-product">
									Nový produkt
								</Link>
							</article>
						</li>

						<li>
							<div id="orders-cont" onClick={setActive}>
								<FontAwesomeIcon className={css.icon} icon={faBasketShopping} />
								<label>Objednávky</label>
								<FontAwesomeIcon className={css.smallarrow} icon={faChevronDown} />
							</div>

							<article>
								<Link to="/orders" onClick={setActiveLink} id="orders">
									Přehled objednávek
								</Link>
							</article>
						</li>

						<li>
							<div id="settings" onClick={setActive}>
								<FontAwesomeIcon className={css.icon} icon={faGear} />
								<label>Nastavení</label>
								<FontAwesomeIcon className={css.smallarrow} icon={faChevronDown} />
							</div>

							<article>
								<Link to="/profile" onClick={setActiveLink} id="profile">
									Uživatelský profil
								</Link>
							</article>
						</li>

						<li>
							<div id="logout" onClick={logOut}>
								<FontAwesomeIcon className={css.icon} icon={faPowerOff} />
								<label>Odhlásit</label>
							</div>
						</li>
					</motion.ul>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default MobileMenu;
