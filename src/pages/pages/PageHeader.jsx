import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import Page from "./Page";
import { useNavigate } from "react-router-dom";

import css from "./Pages.module.css";
import { AnimatePresence } from "framer-motion";

export default function PageHeader({ page }) {
	const navigate = useNavigate();
	const [isPagePartsVisible, setIsPagePartsVisible] = useState(false);

	return (
		<>
			<li className={css.page_header} onClick={() => setIsPagePartsVisible((prev) => !prev)}>
				<div className={css.info}>
					<b>{page.pageName}</b>
				</div>
				<FontAwesomeIcon className={isPagePartsVisible ? `${css.btn_show} ${css.active}` : css.btn_show} icon={faChevronUp} />
			</li>

			<AnimatePresence>
				{isPagePartsVisible &&
					page.pageParts.map((part, index) => (
						<Page key={`page-${part.id}`} page={part} redirectToPage={() => navigate(`/page/${part.name}`)} index={index} />
					))}
			</AnimatePresence>
		</>
	);
}
