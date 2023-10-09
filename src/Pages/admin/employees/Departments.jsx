import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { createDepartment, getDepartments, removeDepartment, updateDepartment } from "../../modules/ApiEmployees";
import { faFont } from "@fortawesome/free-solid-svg-icons";
import InputBox from "../../Components/basic/InputBox";
import Item from "../gallery/Item";

import css from "./Departments.module.css";

export default function Departments({ setEmployees, departments, setDepartments, refreshAllData, filterEmployeesByDepartment }) {
	const auth = useAuth();
	const { setMessage } = useInteraction();
	const { register, handleSubmit, setValue } = useForm();

	async function get() {
		const departmentsData = await getDepartments();
		setDepartments(departmentsData);
	}

	const create = async (data) => {
		await createDepartment(data, auth, setMessage);
		setValue("name", "");
		get();
	};

	const update = async (data) => {
		await updateDepartment(data, auth, setMessage);
		refreshAllData();
	};

	const remove = async (id) => {
		await removeDepartment(id, auth, setMessage);
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
			<h3>Přidat oddělení:</h3>
			<form onSubmit={handleSubmit(create)}>
				<InputBox placeholder={"Název oddělení"} name={"name"} register={register} type={"text"} icon={faFont} white={false} isRequired={true} />
				<button>Vytvořit</button>
			</form>
		</section>
	);
}
