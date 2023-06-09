import { useState, useEffect } from "react";
import { getAll, test, remove } from "../../modules/ApiVacancies";
import { makeDateFormat } from "../../modules/BasicFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPen } from "@fortawesome/free-solid-svg-icons";
import css from "./Vacancies.module.css";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import PlusButton from "../../Components/basic/PlusButton";

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
		const data = await getAll();
		setVacancies(data);
	}

	function openVacancy(id) {
		navigate(`/dashboard/vacancy/${id}`);
	}

	function newVacancy() {
		navigate(`/dashboard/vacancy`);
	}

	async function deleteHandler(id) {
		await remove(id, auth, setMessage);
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
			<PlusButton onClick={newVacancy} />
		</>
	);
}
