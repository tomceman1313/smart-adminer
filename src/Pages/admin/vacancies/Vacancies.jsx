import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlusButton from "../../Components/basic/PlusButton";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { getAll, remove } from "../../modules/ApiFunctions";
import { makeDateFormat, publicPath } from "../../modules/BasicFunctions";
import css from "./Vacancies.module.css";

export default function Vacancies() {
	const auth = useAuth();
	const navigate = useNavigate();
	const { setMessage, setAlert } = useInteraction();
	const [vacancies, setVacancies] = useState(null);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Inzerát pracovní pozice";
		document.getElementById("banner-desc").innerHTML = "Tvořte a spravujte inzeráty pracovních pozic";
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
		await remove("vacancies", id, setMessage, "Inzerát byl odstraněn", auth);
		getData();
	}

	function deleteVacancy(id) {
		setAlert({ id: id, question: "Opravdu si přejete smazat inzerát?", positiveHandler: deleteHandler });
	}

	return (
		<>
			<section>
				<h2>Pracovní místa</h2>
				<ul className={css.vacancies}>
					{vacancies ? (
						vacancies.map((el) => (
							<li key={`vac-${el.id}`}>
								<img src={`${publicPath}/images/vacancies/${el.image}`} alt="" />
								<div>
									<b>{el.title}</b>
									<label>{makeDateFormat(el.date, "str")}</label>
								</div>
								<FontAwesomeIcon icon={faPen} onClick={() => openVacancy(el.id)} />
								<FontAwesomeIcon icon={faTrashCan} onClick={() => deleteVacancy(el.id)} />
							</li>
						))
					) : (
						<p>Dosud nebyly přidany žádné inzeráty</p>
					)}
				</ul>
			</section>
			<PlusButton onClick={() => navigate(`/vacancy`)} />
		</>
	);
}
