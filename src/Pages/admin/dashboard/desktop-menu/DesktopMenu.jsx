import { useRef } from "react";
import { Link } from "react-router-dom";

import { faIdCard, faNewspaper } from "@fortawesome/free-regular-svg-icons";
import {
	faBasketShopping,
	faCalendarDays,
	faChevronDown,
	faDisplay,
	faGear,
	faPeopleGroup,
	faPowerOff,
	faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { publicPath } from "../../../modules/BasicFunctions";

import css from "./DesktopMenu.module.css";

export default function DesktopMenu({ logOut }) {
	const activeMenu = useRef(null);
	const activeMenuItem = useRef(null);

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
		<div className={css.menu}>
			<div className={css.logo_cont}>
				<img src={`${publicPath}/images/logo512.png`} alt="logo" />
				<label className={css.title}>Adminer</label>
			</div>
			<ul>
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
					<div id="articles-cont" onClick={setActive}>
						<FontAwesomeIcon className={css.icon} icon={faNewspaper} />
						<label>Články</label>
						<FontAwesomeIcon className={css.smallarrow} icon={faChevronDown} />
					</div>

					<article>
						<Link to="/articles" onClick={setActiveLink} id="articles">
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
			</ul>
		</div>
	);
}
