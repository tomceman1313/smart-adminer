import { faCaretDown, faUser, faIdBadge, faMobileScreen, faAt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import PlusButton from "../../Components/basic/PlusButton";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { getAll, remove } from "../../modules/ApiEmployees";
import css from "./Employees.module.css";
import { AnimatePresence } from "framer-motion";
import Employee from "./Employee";

export default function Employees() {
	const auth = useAuth();
	const { setMessage, setAlert } = useInteraction();
	const [employees, setEmployees] = useState([]);
	const [employee, setEmployee] = useState(null);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Seznam zaměstnanců";
		document.getElementById("banner-desc").innerHTML = "Tvorba a správa zaměstnaneckých profilů";
		getData();
	}, []);

	async function getData() {
		const data = await getAll();
		setEmployees(data);
	}

	function newEmployee() {
		setEmployee([]);
	}

	async function deleteHandler(id) {
		await remove(id, auth, setMessage);
		getData();
	}

	function deleteEmployee(id) {
		setAlert({ id: id, question: "Opravdu si přejete smazat profil zaměstnance?", positiveHandler: deleteHandler });
	}

	function showMoreInfo(e) {
		const el = e.target.parentNode;
		const article = el.parentNode.childNodes[1];

		const arrow = e.target.firstChild;

		if (article.classList.contains(css.active)) {
			article.classList.remove(css.active);
			arrow.classList.remove(css.rotate);
		} else {
			article.classList.add(css.active);
			arrow.classList.add(css.rotate);
		}
	}

	return (
		<>
			<section className="no-section">
				<ul className={css.employees}>
					{employees === [] ? (
						employees.map((user) => (
							<li key={user.id}>
								<div>
									<FontAwesomeIcon icon={faCaretDown} className={css.show} onClick={showMoreInfo} />
								</div>
								<article>
									<label>
										<FontAwesomeIcon icon={faIdBadge} />
										{user.fname + " " + user.lname}
									</label>
									<label>
										<FontAwesomeIcon icon={faMobileScreen} /> {user.tel}
									</label>
									<label>
										<FontAwesomeIcon icon={faAt} /> {user.email}
									</label>
									<button onClick={() => setEmployee(user)}>Upravit</button>
									<button onClick={() => deleteEmployee(user.id)}>Smazat</button>
								</article>
							</li>
						))
					) : (
						<section>Nejsou vloženy žádné profily zaměstnanců</section>
					)}
				</ul>
			</section>

			<AnimatePresence>{employee && <Employee setEmployee={setEmployee} />}</AnimatePresence>

			<PlusButton onClick={newEmployee} />
		</>
	);
}
