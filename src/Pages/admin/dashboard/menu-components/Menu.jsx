import { faIdCard, faNewspaper } from "@fortawesome/free-regular-svg-icons";
import { faBasketShopping, faCalendarDays, faDisplay, faGear, faPeopleGroup, faPowerOff, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import MenuLink from "./MenuLink";
import MenuSection from "./MenuSection";

import css from "./MenuComponents.module.css";

export default function Menu({ logOut }) {
	const location = useLocation();

	const [activeSection, setActiveSection] = useState("");
	const [activeLink, setActiveLink] = useState("");

	useEffect(() => {
		const path = location.pathname.split("/");
		setActiveLink(path[1]);
	}, [location]);

	function openMenuSection(sectionName) {
		if (sectionName === activeSection) {
			setActiveSection("");
		} else {
			setActiveSection(sectionName);
		}
	}

	return (
		<>
			<MenuSection title="Uživatelské profily" name="profiles" icon={faIdCard} activeSection={activeSection} openMenuSection={openMenuSection}>
				<MenuLink title="Seznam uživatelů" name="users" path="/users" activeLink={activeLink} />
				<MenuLink title="Registrace" name="register" path="/register" activeLink={activeLink} />
			</MenuSection>

			<MenuSection title="Zaměstnanci" name="employees-section" icon={faPeopleGroup} activeSection={activeSection} openMenuSection={openMenuSection}>
				<MenuLink title="Seznam zaměstnanců" name="employees" path="/employees" activeLink={activeLink} />
				<MenuLink title="Inzerované pozice" name="vacancies" path="/vacancies" activeLink={activeLink} />
			</MenuSection>

			<MenuSection title="Obsah webu" name="content" icon={faDisplay} activeSection={activeSection} openMenuSection={openMenuSection}>
				<MenuLink title="Stránky" name="pages" path="/pages" activeLink={activeLink} />
				<MenuLink title="Galerie" name="gallery" path="/gallery" activeLink={activeLink} />
				<MenuLink title="Dokumenty" name="documents" path="/documents" activeLink={activeLink} />
				<MenuLink title="Ceník" name="pricelist" path="/pricelist" activeLink={activeLink} />
				<MenuLink title="Upozornění" name="notifications" path="/notifications" activeLink={activeLink} />
			</MenuSection>

			<MenuSection title="Články" name="articles-section" icon={faNewspaper} activeSection={activeSection} openMenuSection={openMenuSection}>
				<MenuLink title="Přehled článků" name="articles" path="/articles" activeLink={activeLink} />
				<MenuLink title="Nový článek" name="new-article" path="/new-article" activeLink={activeLink} />
			</MenuSection>

			<MenuSection title="Události" name="events-section" icon={faCalendarDays} activeSection={activeSection} openMenuSection={openMenuSection}>
				<MenuLink title="Přehled událostí" name="events" path="/events" activeLink={activeLink} />
				<MenuLink title="Nová událost" name="new-event" path="/new-event" activeLink={activeLink} />
			</MenuSection>

			<MenuSection title="Produkty" name="products-section" icon={faShoppingCart} activeSection={activeSection} openMenuSection={openMenuSection}>
				<MenuLink title="Přehled produktů" name="products" path="/products" activeLink={activeLink} />
				<MenuLink title="Nový produkt" name="new-product" path="/new-product" activeLink={activeLink} />
			</MenuSection>

			<MenuSection title="Objednávky" name="orders-section" icon={faBasketShopping} activeSection={activeSection} openMenuSection={openMenuSection}>
				<MenuLink title="Přehled objednávek" name="orders" path="/orders" activeLink={activeLink} />
			</MenuSection>

			<MenuSection title="Nastavení" name="settings" icon={faGear} activeSection={activeSection} openMenuSection={openMenuSection}>
				<MenuLink title="Uživatelský profil" name="profile" path="/profile" activeLink={activeLink} />
			</MenuSection>

			<li className={css.menu_section}>
				<div id="logout" onClick={logOut}>
					<FontAwesomeIcon className={css.icon} icon={faPowerOff} />
					<label>Odhlásit</label>
				</div>
			</li>
		</>
	);
}
