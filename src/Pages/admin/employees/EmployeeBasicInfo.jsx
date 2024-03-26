import { faAt, faCaretDown, faIdBadge, faMobileScreen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { publicPath } from "../../modules/BasicFunctions";
import css from "./Employees.module.css";
import { useTranslation } from "react-i18next";

export default function EmployeeBasicInfo({ user, deleteEmployee, setEmployee }) {
	const { t } = useTranslation("employees");
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
			<img
				src={user.image ? `${publicPath}/images/employees/${user.image}` : `${publicPath}/images/employees/no_photo.jpg`}
				alt={t("altProfileImage")}
			/>
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
						{user?.phone && (
							<label>
								<FontAwesomeIcon icon={faMobileScreen} /> {user.phone}
							</label>
						)}
						{user.email && (
							<label>
								<FontAwesomeIcon icon={faAt} /> {user.email}
							</label>
						)}
						<button onClick={showAllInfo}>{t("buttonShowEmployeeDetail")}</button>
						<button className="red_button" onClick={() => deleteEmployee(user.id, `${user.fname} ${user.lname}`)}>
							{t("buttonDeleteEmployee")}
						</button>
					</motion.article>
				)}
			</AnimatePresence>
		</li>
	);
}
