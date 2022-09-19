import React from "react";
import { Link } from "react-router-dom";

import { faIdCard, faNewspaper } from "@fortawesome/free-regular-svg-icons";
import { faChevronDown, faDisplay, faGear, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import css from "../styles/SideMenu.module.css";

export default function SideMenu({ logOut }) {
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
						<Link to="/dashboard/alerts" onClick={setActiveLink} id="alerts">
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
						<Link to="/dashboard/articles">Přehled článků</Link>
						<Link to="/dashboard/new_article">Nový článek</Link>
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

function setActive(e) {
	let id = e.currentTarget.id;
	let active = document.querySelector(`.${css.active}`) != null ? document.querySelector(`.${css.active}`).firstChild.id : "";

	if (active === "") {
		document.getElementById(id).parentNode.classList.add(css.active);
		return;
	}

	if (id !== active) {
		document.querySelector(`.${css.active}`).classList.remove(css.active);
		document.getElementById(id).parentNode.classList.add(css.active);
	} else {
		document.querySelector(`.${css.active}`).classList.remove(css.active);
	}
}

function setActiveLink(e) {
	let id = e.currentTarget.id;
	let active = document.querySelector(`.${css.active_link}`) != null ? document.querySelector(`.${css.active_link}`).firstChild.id : "";

	if (active === "") {
		document.getElementById(id).classList.add(css.active_link);
		return;
	}

	if (id !== active) {
		document.querySelector(`.${css.active_link}`).classList.remove(css.active_link);
		document.getElementById(id).classList.add(css.active_link);
	}
}
