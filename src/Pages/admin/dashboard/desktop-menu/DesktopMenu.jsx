import React, { useRef } from "react";
import { Link } from "react-router-dom";

import { faIdCard, faNewspaper } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown, faDisplay, faGear, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
			<img src="/images/logo512.png" alt="logo" />
			<label className={css.title}>Adminer</label>
			<ul>
				<li>
					<div id="profiles" onClick={setActive}>
						<FontAwesomeIcon className={css.icon} icon={faIdCard} />
						<label>Uživatelské profily</label>
						<FontAwesomeIcon className={css.smallarrow} icon={faChevronDown} />
					</div>

					<article>
						<Link to="/dashboard/users" onClick={setActiveLink} id="users">
							Seznam uživatelů
						</Link>
						<Link to="/dashboard/register" onClick={setActiveLink} id="register">
							Register
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
						<Link to="/dashboard/pricelist" onClick={setActiveLink} id="pricelist">
							Ceník
						</Link>
						<Link to="/dashboard/gallery" onClick={setActiveLink} id="gallery">
							Galerie
						</Link>
						<Link to="/dashboard/notifications" onClick={setActiveLink} id="notifications">
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
						<Link to="/dashboard/articles" onClick={setActiveLink} id="allArticles">
							Přehled článků
						</Link>
						<Link to="/dashboard/new-article" onClick={setActiveLink} id="new-article">
							Nový článek
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
						<Link to="/dashboard/pricelist">Přehled článků</Link>
						<Link to="/dashboard/articles">Nový článek</Link>
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