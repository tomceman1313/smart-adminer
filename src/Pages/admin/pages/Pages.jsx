import { useState, useEffect } from "react";
import { getAll } from "../../modules/ApiFunctions";
import { useNavigate } from "react-router-dom";

import css from "./Pages.module.css";
import Page from "./Page";

export default function Pages() {
	const [pages, setPages] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		loadPages();
	}, []);

	async function loadPages() {
		const _pages = await getAll("pages");
		console.log(_pages);
		setPages(_pages);
	}

	return (
		<div>
			<section>
				<h2>Stránky</h2>
				<ul className={css.vacancies}>
					{pages ? (
						pages.map((page) => <Page key={`page-${page.id}`} page={page} redirectToPage={() => navigate(`/page/${page.id}`)} />)
					) : (
						<p>Dosud nebyly přidány žádné obsahy stránek.</p>
					)}
				</ul>
			</section>
		</div>
	);
}
