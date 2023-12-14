import { useEffect, useState } from "react";
import { getAll } from "../../modules/ApiFunctions";

import PageHeader from "./PageHeader";
import css from "./Pages.module.css";
import { Helmet } from "react-helmet";

export default function Pages() {
	const [pages, setPages] = useState(null);

	useEffect(() => {
		loadPages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function loadPages() {
		const _pages = await getAll("pages");
		setPages(sortByPageName(_pages));
	}

	function sortByPageName(initialData) {
		const allPageNames = initialData.reduce((allPageNames, page) => {
			if (allPageNames.includes(page.page_name)) {
				return allPageNames;
			}
			return [...allPageNames, page.page_name];
		}, []);

		const sortedData = allPageNames.map((pageName) => {
			return { pageName: pageName, pageParts: initialData.filter((page) => page.page_name === pageName) };
		});
		return sortedData;
	}

	return (
		<div>
			<Helmet>
				<title>Stránky | SmartAdminer</title>
			</Helmet>

			<section>
				<h2>Stránky</h2>
				<ul className={css.vacancies}>
					{pages ? pages.map((page) => <PageHeader key={page.pageName} page={page} />) : <p>Dosud nebyly přidány žádné obsahy stránek.</p>}
				</ul>
			</section>
		</div>
	);
}
