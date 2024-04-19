import { faIdCard, faNewspaper } from "@fortawesome/free-regular-svg-icons";
import { faBasketShopping, faCalendarDays, faDisplay, faGear, faPeopleGroup, faPowerOff, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import MenuLink from "./MenuLink";
import MenuSection from "./MenuSection";
import { ROUTES } from "../routes";

import css from "./MenuComponents.module.css";
import { useTranslation } from "react-i18next";

export default function Menu({ permissions, logOut }) {
	const location = useLocation();
	const { t } = useTranslation("menu");

	const [activeSection, setActiveSection] = useState("dfd");
	const [activeLink, setActiveLink] = useState("");

	useEffect(() => {
		const path = location.pathname.split("/");
		const activeRoute = ROUTES.find((route) => route.name === path[1]);
		if (activeRoute) {
			setActiveLink(activeRoute.name);
			setActiveSection(activeRoute.menuSection);
		}
	}, [location]);

	return (
		<>
			{permissions.users && (
				<MenuSection title={t("userAccounts.name")} name="profiles" icon={faIdCard} activeSection={activeSection} openMenuSection={setActiveSection}>
					<MenuLink title={t("userAccounts.usersList")} name="users" path="/users" activeLink={activeLink} />
					<MenuLink title={t("userAccounts.rolesAndPrivileges")} name="roles" path="/roles" activeLink={activeLink} />
				</MenuSection>
			)}

			{(permissions.employees || permissions.vacancies) && (
				<MenuSection
					title={t("employees.name")}
					name="employees-section"
					icon={faPeopleGroup}
					activeSection={activeSection}
					openMenuSection={setActiveSection}
				>
					{permissions.employees && <MenuLink title={t("employees.employeesList")} name="employees" path="/employees" activeLink={activeLink} />}
					{permissions.vacancies && <MenuLink title={t("employees.vacancies")} name="vacancies" path="/vacancies" activeLink={activeLink} />}
				</MenuSection>
			)}

			{(permissions.pages || permissions.gallery || permissions.documents || permissions.pricelist || permissions.notifications) && (
				<MenuSection
					title={t("websiteContent.name")}
					name="content"
					icon={faDisplay}
					activeSection={activeSection}
					openMenuSection={setActiveSection}
				>
					{permissions.pages && <MenuLink title={t("websiteContent.sites")} name="pages" path="/pages" activeLink={activeLink} />}
					{permissions.gallery && <MenuLink title={t("websiteContent.gallery")} name="gallery" path="/gallery" activeLink={activeLink} />}
					{permissions.documents && <MenuLink title={t("websiteContent.documents")} name="documents" path="/documents" activeLink={activeLink} />}
					{permissions.pricelist && <MenuLink title={t("websiteContent.priceList")} name="pricelist" path="/pricelist" activeLink={activeLink} />}
					{permissions.notifications && (
						<MenuLink title={t("websiteContent.notifications")} name="notifications" path="/notifications" activeLink={activeLink} />
					)}
				</MenuSection>
			)}

			{permissions.articles && (
				<MenuSection
					title={t("articles.name")}
					name="articles-section"
					icon={faNewspaper}
					activeSection={activeSection}
					openMenuSection={setActiveSection}
					redirectLocation="/articles"
				>
					<MenuLink title={t("articles.allArticles")} name="articles" path="/articles" activeLink={activeLink} />
					<MenuLink title={t("articles.newArticle")} name="new-article" path="/new-article" activeLink={activeLink} />
				</MenuSection>
			)}

			{permissions.events && (
				<MenuSection
					title={t("events.name")}
					name="events-section"
					icon={faCalendarDays}
					activeSection={activeSection}
					openMenuSection={setActiveSection}
					redirectLocation="/events"
				>
					<MenuLink title={t("events.allEvents")} name="events" path="/events" activeLink={activeLink} />
					<MenuLink title={t("events.newEvent")} name="new-event" path="/new-event" activeLink={activeLink} />
				</MenuSection>
			)}

			{permissions.products && (
				<MenuSection
					title={t("products.name")}
					name="products-section"
					icon={faShoppingCart}
					activeSection={activeSection}
					openMenuSection={setActiveSection}
					redirectLocation="/products"
				>
					<MenuLink title={t("products.allProducts")} name="products" path="/products" activeLink={activeLink} />
					<MenuLink title={t("products.newProduct")} name="new-product" path="/new-product" activeLink={activeLink} />
				</MenuSection>
			)}

			{permissions.orders && (
				<MenuSection
					title={t("orders.name")}
					name="orders-section"
					icon={faBasketShopping}
					activeSection={activeSection}
					openMenuSection={setActiveSection}
					redirectLocation="/orders"
				>
					<MenuLink title={t("orders.allOrders")} name="orders" path="/orders" activeLink={activeLink} />
				</MenuSection>
			)}

			{permissions && (
				<MenuSection
					title={t("settings.name")}
					name="settings-section"
					icon={faGear}
					activeSection={activeSection}
					openMenuSection={setActiveSection}
				>
					<MenuLink title={t("settings.userAccount")} name="profile" path="/profile" activeLink={activeLink} />
				</MenuSection>
			)}

			<li className={css.menu_section}>
				<div id="logout" onClick={logOut}>
					<FontAwesomeIcon className={css.icon} icon={faPowerOff} />
					<label className={css.section_title}>{t("logout.name")}</label>
				</div>
			</li>
		</>
	);
}
