import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useInteraction from "../../hooks/useInteraction";
import { createDepartment, getDepartments, removeDepartment, updateDepartment } from "../../modules/ApiEmployees";
import { faFont } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import InputBox from "../../components/basic/InputBox";
import Item from "../../components/common/controlled-item/Item";

import css from "./Departments.module.css";
import { useTranslation } from "react-i18next";

export default function Departments({ departments, setDepartments, refreshAllData, filterEmployeesByDepartment }) {
	const auth = useAuth();
	const { t } = useTranslation("employees");
	const { setMessage } = useInteraction();
	const { register, handleSubmit, setValue } = useForm();

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function loadData() {
		const departmentsData = await getDepartments();
		setDepartments(departmentsData);
	}

	const create = async (data) => {
		if (departments.find((dep) => dep.name === data.name)) {
			setMessage({ action: "alert", text: t("messageNameIsTaken") });
			return;
		}
		await createDepartment(data, auth, setMessage, t("positiveTextCreateDepartment"));
		setValue("name", "");
		loadData();
	};

	const update = async (data) => {
		data.name = data.name.trim();
		await updateDepartment(data, auth, setMessage, t("positiveTextUpdateDepartment"));
		refreshAllData();
	};

	const remove = async (id) => {
		await removeDepartment(id, auth, setMessage, t("positiveTextDeleteDepartment"));
		loadData();
		refreshAllData();
	};

	return (
		<section className={css.departments}>
			<h2>{t("headerDepartments")}</h2>
			<ul className={css.departments_list}>
				{departments &&
					departments.map((el) => (
						<Item
							key={el.id}
							el={el}
							remove={remove}
							edit={update}
							show={() => filterEmployeesByDepartment(el.id, el.name)}
							deleteQuestion={t("alertDeleteDepartment", { name: el.name })}
						/>
					))}
			</ul>
			<div className={css.blur}></div>
			<h3>{t("headerAddNewDepartment")}</h3>
			<form onSubmit={handleSubmit(create)}>
				<InputBox
					placeholder={t("placeholderNewDepartment")}
					name={"name"}
					register={register}
					type={"text"}
					icon={faFont}
					white={false}
					isRequired
				/>
				<button>{t("buttonCreateDepartment")}</button>
			</form>
		</section>
	);
}
