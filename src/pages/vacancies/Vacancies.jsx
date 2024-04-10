import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlusButton from "../../components/basic/PlusButton";
import { Helmet } from "react-helmet-async";
import useAuth from "../../hooks/useAuth";
import useInteraction from "../../hooks/useInteraction";
import { getAll, remove } from "../../modules/ApiFunctions";
import { makeDateFormat, publicPath } from "../../modules/BasicFunctions";
import css from "./Vacancies.module.css";
import { useTranslation } from "react-i18next";

export default function Vacancies() {
	const { t } = useTranslation("vacancies");
	const auth = useAuth();
	const navigate = useNavigate();
	const { setMessage, setAlert } = useInteraction();
	const [vacancies, setVacancies] = useState(null);

	useEffect(() => {
		getData();
	}, []);

	async function getData() {
		const data = await getAll("vacancies");
		setVacancies(data);
	}

	function openVacancy(id) {
		navigate(`/vacancy/${id}`);
	}

	async function deleteHandler(id) {
		await remove("vacancies", id, setMessage, t("positiveTextAdDeleted"), auth);
		getData();
	}

	function deleteVacancy(id) {
		setAlert({ id: id, question: t("alertDeleteAd"), positiveHandler: deleteHandler });
	}

	return (
		<>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<section>
				<h2>{t("headerPositions")}</h2>
				<ul className={css.vacancies}>
					{vacancies ? (
						vacancies.map((el) => (
							<li key={`vac-${el.id}`}>
								<img src={`${publicPath}/images/vacancies/${el.image}`} alt="" />
								<div>
									<b>{el.title}</b>
									<label>{makeDateFormat(el.date, "text")}</label>
								</div>
								<FontAwesomeIcon icon={faPen} onClick={() => openVacancy(el.id)} />
								<FontAwesomeIcon icon={faTrashCan} onClick={() => deleteVacancy(el.id)} />
							</li>
						))
					) : (
						<p>{t("noDataFound")}</p>
					)}
				</ul>
			</section>
			<PlusButton onClick={() => navigate(`/vacancy`)} />
		</>
	);
}
