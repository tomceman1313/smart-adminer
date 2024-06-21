import { faFont } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import InputBox from "../../components/basic/InputBox";
import Item from "../../components/common/controlled-item/Item";
import warningToast from "../../components/common/warning-toast/WarningToast";
import useAuth from "../../hooks/useAuth";
import {
	createDepartment,
	removeDepartment,
	updateDepartment,
} from "../../modules/ApiEmployees";
import css from "./Departments.module.css";
import Form from "../../components/basic/form/Form";

export default function Departments({
	departments,
	filterEmployeesByDepartment,
}) {
	const queryClient = useQueryClient();
	const auth = useAuth();
	const { t } = useTranslation("employees");
	const formMethods = useForm();

	const create = async (data) => {
		if (departments.find((dep) => dep.name === data.name)) {
			warningToast(t("messageNameIsTaken"));
			return;
		}
		await createDepartment(data, auth, t("positiveTextCreateDepartment"));
		formMethods.setValue("name", "");
		queryClient.invalidateQueries({ queryKey: ["departments"] });
	};

	const update = async (data) => {
		data.name = data.name.trim();
		await updateDepartment(data, auth, t("positiveTextUpdateDepartment"));
		queryClient.invalidateQueries({ queryKey: ["employees"] });
		queryClient.invalidateQueries({ queryKey: ["departments"] });
	};

	const remove = async (id) => {
		await removeDepartment(id, auth, t("positiveTextDeleteDepartment"));
		queryClient.invalidateQueries({ queryKey: ["employees"] });
		queryClient.invalidateQueries({ queryKey: ["departments"] });
	};

	return (
		<section className={css.departments}>
			<h2>{t("headerDepartments")}</h2>
			<ul className={css.departments_list}>
				{departments?.length > 0 ? (
					departments.map((el) => (
						<Item
							key={el.id}
							el={el}
							remove={remove}
							edit={update}
							show={() => filterEmployeesByDepartment(el.id, el.name)}
							deleteQuestion={t("alertDeleteDepartment", { name: el.name })}
						/>
					))
				) : (
					<p>{t("noDepartmentsFound")}</p>
				)}
			</ul>
			<div className={css.blur}></div>
			<h3>{t("headerAddNewDepartment")}</h3>
			<Form onSubmit={create} formContext={formMethods}>
				<InputBox
					placeholder={t("placeholderNewDepartment")}
					name={"name"}
					type={"text"}
					icon={faFont}
					white={false}
					isRequired
				/>
				<button>{t("buttonCreateDepartment")}</button>
			</Form>
		</section>
	);
}
