import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useViewport from "../../hooks/useViewport";
import { PAGES_BANNER_INFO } from "./bannerInfo";

import { useTranslation } from "react-i18next";
import css from "./Banner.module.css";

export default function Banner() {
	const location = useLocation();
	const { width } = useViewport();
	const { t } = useTranslation("banner");

	const [bannerInfo, setBannerInfo] = useState(PAGES_BANNER_INFO[0]);

	useEffect(() => {
		let path = location.pathname;

		//page has param name --> skip checks
		if (path.includes("page") && !path.includes("pages")) {
			path = "/page";
		}

		//remove numbers (ids) in url
		while (
			Number(path.charAt(path.length - 1)) ||
			Number(path.charAt(path.length - 1)) === 0
		) {
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
			<h1 id="banner-title">{t(bannerInfo.title)}</h1>
			<p id="banner-desc">{t(bannerInfo.description)}</p>
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
