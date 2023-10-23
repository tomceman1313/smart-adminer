import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { createDepartment, getDepartments, removeDepartment, updateDepartment } from "../../modules/ApiEmployees";
import { faFont } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import InputBox from "../../Components/basic/InputBox";
import Item from "../gallery/Item";

import css from "./Departments.module.css";

export default function Departments({ departments, setDepartments, refreshAllData, filterEmployeesByDepartment }) {
	const auth = useAuth();
	const { setMessage } = useInteraction();
	const { register, handleSubmit, setValue } = useForm();

	useEffect(() => {
		get();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function get() {
		const departmentsData = await getDepartments();
		setDepartments(departmentsData);
	}

	const create = async (data) => {
		if (departments.find((dep) => dep.name === data.name)) {
			setMessage({ action: "alert", text: "Oddělení s tímto názvem již existuje" });
			return;
		}
		await createDepartment(data, auth, setMessage);
		setValue("name", "");
		get();
	};

	const update = async (data) => {
		data.name = data.name.trim();
		await updateDepartment(data, auth, setMessage);
		refreshAllData();
	};

	const remove = async (id) => {
		await removeDepartment(id, auth, setMessage);
		get();
		refreshAllData();
	};

	return (
		<section className={css.departments}>
			<h2>Oddělení</h2>
			<ul className={css.departments_list}>
				{departments &&
					departments.map((el) => (
						<Item
							key={el.id}
							el={el}
							remove={remove}
							edit={update}
							show={() => filterEmployeesByDepartment(el.id, el.name)}
							deleteQuestion="Opravdu si přejete odstranit oddělení?"
						/>
					))}
			</ul>
			<div className={css.blur}></div>
			<h3>Přidat oddělení:</h3>
			<form onSubmit={handleSubmit(create)}>
				<InputBox placeholder={"Název oddělení"} name={"name"} register={register} type={"text"} icon={faFont} white={false} isRequired={true} />
				<button>Vytvořit</button>
			</form>
		</section>
	);
}
