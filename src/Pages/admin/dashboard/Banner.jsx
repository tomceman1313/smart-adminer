import { useEffect, useState } from "react";
import useViewport from "../../Hooks/useViewport";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import css from "./Dashboard.module.css";

const PAGES_BANNER_INFO = [
	{
		path: "/",
		title: "Přehled",
		description: "Nejdůležitější informace z chodu stránek",
	},
	{
		path: "/users",
		title: "Správa profilů",
		description: "Přehled a správa profilů",
	},
	{
		path: "/roles",
		title: "Role a práva",
		description: "Přehled a správa práv rolí",
	},
	{
		path: "/employees",
		title: "Seznam zaměstnanců",
		description: "Tvorba a správa zaměstnaneckých profilů",
	},
	{
		path: "/vacancies",
		title: "Inzeráty pracovních pozic",
		description: "Tvořte a spravujte inzeráty pracovních pozic",
	},
	{
		path: "/vacancy",
		title: "Inzerát pracovní pozice",
		description: "Tvořte a spravujte inzeráty pracovních pozic",
	},
	{
		path: "/pages",
		title: "Stránky",
		description: "Upravuje dynamický obsah svých webových stránek",
	},
	{
		path: "/page",
		title: "Obsah stránky",
		description: "Upravuje dynamický obsah webové stránky",
	},
	{
		path: "/gallery",
		title: "Galerie",
		description: "Správa fotek v galerii a tvorba kategorií pro jejich rozřazení",
	},
	{
		path: "/documents",
		title: "Dokumentový server",
		description: "Správa dokumentů a tvorba kategorií pro jejich rozřazení",
	},
	{
		path: "/pricelist",
		title: "Ceník",
		description: "Úprava cen, vytváření nových položek, správa akčních cen",
	},
	{
		path: "/notifications",
		title: "Upozornění",
		description: "Informujte své návštěvníky o mimořádných událostech",
	},
	{
		path: "/articles",
		title: "Články",
		description: "Tvořte a spravujte vlastní články",
	},
	{
		path: "/article",
		title: "Článek",
		description: "Tvořte a spravujte článek",
	},
	{
		path: "/new-article",
		title: "Články",
		description: "Tvořte a spravujte vlastní články",
	},
	{
		path: "/events",
		title: "Události",
		description: "Tvořte a spravujte proběhlé nebo teprv plánované události",
	},
	{
		path: "/event",
		title: "Událost",
		description: "Tvořte a spravujte proběhlé nebo teprv plánované události",
	},
	{
		path: "/new-event",
		title: "Události",
		description: "Tvořte a spravujte proběhlé nebo teprv plánované události",
	},
	{
		path: "/products",
		title: "Produkty",
		description: "Přehled vytvořených produktů, správa kategorií a slev",
	},
	{
		path: "/product",
		title: "Produkt",
		description: "Tvorba a správa produktu",
	},
	{
		path: "/new-product",
		title: "Produkt",
		description: "Správa produktu a jeho tvorba",
	},
	{
		path: "/orders",
		title: "Objednávky",
		description: "Přehled obdržených objednávek, možnost jejich vyřízení",
	},
	{
		path: "/profile",
		title: "Správa profilu",
		description: "Přehled a správa uživatelského profilu",
	},
];

export default function Banner() {
	const location = useLocation();
	const { width } = useViewport();

	const [bannerInfo, setBannerInfo] = useState(PAGES_BANNER_INFO[0]);

	useEffect(() => {
		let path = location.pathname;

		//page has param name --> skip checks
		if (path.includes("page") && !path.includes("pages")) {
			path = "/page";
		}

		//remove numbers (ids) in url
		while (Number(path.charAt(path.length - 1)) || Number(path.charAt(path.length - 1)) === 0) {
			path = path.slice(0, -1);
		}

		//remove last character if it is slash
		if (path.charAt(path.length - 1) === "/") {
			path = path.slice(0, -1);
		}

		const activePage = PAGES_BANNER_INFO.find((page) => page.path === path);
		if (activePage) {
			setBannerInfo(activePage);
		} else {
			setBannerInfo(PAGES_BANNER_INFO[0]);
		}
	}, [location]);

	return (
		<div className={css.banner}>
			<h1 id="banner-title">{bannerInfo.title}</h1>
			<p id="banner-desc">{bannerInfo.description}</p>
			{width > 900 ? (
				<Link to="profile">
					<FontAwesomeIcon icon={faUser} />
				</Link>
			) : (
				<></>
			)}
		</div>
	);
}
