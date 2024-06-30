import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PlusButton from "../../components/basic/PlusButton";
import SortableItem from "../../components/common/sortable/SortableItem";
import SortableList from "../../components/common/sortable/SortableList";
import NoDataFound from "../../components/loaders/NoDataFound/NoDataFound";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import { useGetAll } from "../../hooks/api/useCRUD";
import useInteraction from "../../hooks/useInteraction";
import css from "./Vacancies.module.css";
import Vacancy from "./Vacancy";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function Vacancies() {
	const { t } = useTranslation("vacancies", "errors");
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { remove, updateOrder } = useBasicApiFunctions();
	const { setAlert } = useInteraction();

	const [vacancies, setVacancies] = useState(null);

	const { data: loadedVacancies, refetch } = useGetAll(
		"vacancies",
		null,
		["vacancies"],
		t("errors:errorFetchVacancies")
	);

	useEffect(() => {
		setVacancies(loadedVacancies);
	}, [loadedVacancies]);

	function openVacancy(id) {
		navigate(`/vacancy/${id}`);
	}

	async function orderVacanciesHandler(vacanciesIds) {
		const previousOrder = loadedVacancies.map((vacancy) => vacancy.id);
		if (JSON.stringify(previousOrder) === JSON.stringify(vacanciesIds)) {
			return;
		}
		const data = { ids: vacanciesIds };
		await updateOrder("vacancies", data, t("positiveTextOrderChanged"));
		queryClient.invalidateQueries({ queryKey: ["vacancies"] });
	}

	async function deleteHandler(id) {
		await remove("vacancies", id, t("positiveTextAdDeleted"));
		refetch();
	}

	function deleteVacancy(id) {
		setAlert({
			id: id,
			question: t("alertDeleteAd"),
			positiveHandler: deleteHandler,
		});
	}

	return (
		<>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<section>
				<h2>{t("headerPositions")}</h2>
				{vacancies && (
					<SortableList
						items={vacancies}
						setState={setVacancies}
						sortCallbackFunction={orderVacanciesHandler}
						overlayElement={OverlayVacancy}
					>
						<ul className={css.vacancies}>
							{vacancies?.length > 0 ? (
								vacancies.map((el) => (
									<SortableItem
										item={el}
										key={`vacancy-${el.id}`}
										className={css.vacancy}
									>
										<Vacancy
											vacancy={el}
											openVacancy={openVacancy}
											deleteVacancy={deleteVacancy}
										/>
									</SortableItem>
								))
							) : (
								<NoDataFound text={t("noDataFound")} />
							)}
						</ul>
					</SortableList>
				)}
			</section>
			<PlusButton onClick={() => navigate(`/vacancy`)} />
		</>
	);
}

function OverlayVacancy(active) {
	return (
		<li className={css.vacancy}>
			<Vacancy
				vacancy={active}
				openVacancy={() => {}}
				deleteVacancy={() => {}}
			/>
		</li>
	);
}
