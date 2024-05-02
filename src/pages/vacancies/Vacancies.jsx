import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PlusButton from "../../components/basic/PlusButton";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import useInteraction from "../../hooks/useInteraction";
import { makeDateFormat, publicPath } from "../../modules/BasicFunctions";
import css from "./Vacancies.module.css";
import NoDataFound from "../../components/loaders/NoDataFound/NoDataFound";

export default function Vacancies() {
	const { t } = useTranslation("vacancies");
	const navigate = useNavigate();
	const { getAll, remove } = useBasicApiFunctions();

	const { setAlert } = useInteraction();

	const { data: vacancies, refetch } = useQuery({
		queryKey: ["vacancies"],
		queryFn: async () => {
			const data = await getAll("vacancies");
			return data;
		},
	});

	function openVacancy(id) {
		navigate(`/vacancy/${id}`);
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
				<ul className={css.vacancies}>
					{vacancies?.length > 0 ? (
						vacancies.map((el) => (
							<li key={`vac-${el.id}`}>
								<img
									src={`${publicPath}/images/vacancies/${el.image}`}
									alt=""
								/>
								<div>
									<b>{el.title}</b>
									<label>{makeDateFormat(el.date, "text")}</label>
								</div>
								<FontAwesomeIcon
									icon={faPen}
									onClick={() => openVacancy(el.id)}
								/>
								<FontAwesomeIcon
									icon={faTrashCan}
									onClick={() => deleteVacancy(el.id)}
								/>
							</li>
						))
					) : (
						<NoDataFound text={t("noDataFound")} />
					)}
				</ul>
			</section>
			<PlusButton onClick={() => navigate(`/vacancy`)} />
		</>
	);
}
