import React from "react";
import { publicPath } from "../../modules/BasicFunctions";
import { makeDateFormat } from "../../modules/BasicFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { DragHandle } from "../../components/common/sortable/DragHandle";
import css from "./Vacancies.module.css";
export default function Vacancy({ vacancy, deleteVacancy, openVacancy }) {
	return (
		<>
			<img src={`${publicPath}/images/vacancies/${vacancy.image}`} alt="" />
			<div>
				<b>{vacancy.title}</b>
				<label>{makeDateFormat(vacancy.date, "text")}</label>
			</div>
			<FontAwesomeIcon
				className={css.icon}
				icon={faPen}
				onClick={() => openVacancy(vacancy.id)}
			/>
			<FontAwesomeIcon
				className={css.icon}
				icon={faTrashCan}
				onClick={() => deleteVacancy(vacancy.id)}
			/>
			<DragHandle id={vacancy.id} />
		</>
	);
}
