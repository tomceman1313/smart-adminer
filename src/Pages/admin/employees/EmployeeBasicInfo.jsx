import { faAt, faCaretDown, faIdBadge, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { publicPath } from "../../modules/BasicFunctions";
import css from "./Employees.module.css";

export default function EmployeeBasicInfo({ user, deleteEmployee, setEmployee }) {
	const [isMoreInfoVisible, setIsMoreInfoVisible] = useState(false);
	const arrowIcon = useRef(null);

	function showMoreInfo() {
		arrowIcon.current.classList.toggle(`${css.rotate}`);
		setIsMoreInfoVisible((prev) => !prev);
	}

	function showAllInfo() {
		setEmployee(user);
	}

	return (
		<li>
			<img src={`${publicPath}/images/employees/${user.image}`} alt="Profilový obrázek zaměstnance" />
			<div>
				<label>{`${user.degree_before} ${user.fname} ${user.lname} ${user.degree_after}`}</label>
				<p>{user.position}</p>
			</div>
			<span className={css.show} onClick={showMoreInfo}>
				<FontAwesomeIcon icon={faCaretDown} ref={arrowIcon} />
			</span>
			<AnimatePresence>
				{isMoreInfoVisible && (
					<motion.article initial={{ maxHeight: 0 }} animate={{ maxHeight: 220 }} exit={{ maxHeight: 0 }} transition={{ duration: 1 }}>
						<label>
							<FontAwesomeIcon icon={faIdBadge} />
							{user.fname + " " + user.lname}
						</label>
						<label>
							<FontAwesomeIcon icon={faMobileScreen} /> {user.phone}
						</label>
						<label>
							<FontAwesomeIcon icon={faAt} /> {user.email}
						</label>
						<button onClick={showAllInfo}>Upravit</button>
						<button className="red_button" onClick={() => deleteEmployee(user.id, `${user.fname} ${user.lname}`)}>
							Smazat
						</button>
					</motion.article>
				)}
			</AnimatePresence>
		</li>
	);
}
