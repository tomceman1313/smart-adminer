import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import NoDataFound from "../../components/loaders/NoDataFound/NoDataFound";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import PageHeader from "./PageHeader";
import css from "./Pages.module.css";

export default function Pages() {
	const { t } = useTranslation("pages");
	const { getAll } = useBasicApiFunctions();

	const { data: pages } = useQuery({
		queryKey: ["pages"],
		queryFn: async () => {
			const _pages = await getAll("pages");
			return sortByPageName(_pages);
		},
	});

	function sortByPageName(initialData) {
		const allPageNames = initialData.reduce((allPageNames, page) => {
			if (allPageNames.includes(page.page_name)) {
				return allPageNames;
			}
			return [...allPageNames, page.page_name];
		}, []);

		const sortedData = allPageNames.map((pageName) => {
			return {
				pageName: pageName,
				pageParts: initialData.filter((page) => page.page_name === pageName),
			};
		});
		return sortedData;
	}

	return (
		<div>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>

			<section>
				<h2>{t("headerPages")}</h2>
				<ul className={css.vacancies}>
					{pages?.length > 0 ? (
						pages.map((page) => <PageHeader key={page.pageName} page={page} />)
					) : (
						<NoDataFound text={t("noPagesFound")} />
					)}
				</ul>
			</section>
		</div>
	);
}
