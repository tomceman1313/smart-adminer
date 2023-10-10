import { useEffect, useRef, useState } from "react";
import PlusButton from "../../Components/basic/PlusButton";
import FilterNotifier from "../../Components/common/filter-notifier/FilterNotifier";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { getAll, remove } from "../../modules/ApiFunctions";
import Departments from "./Departments";
import Employee from "./Employee";
import EmployeeBasicInfo from "./EmployeeBasicInfo";
import css from "./Employees.module.css";

export default function Employees() {
	const auth = useAuth();
	const { setMessage, setAlert } = useInteraction();

	const allEmployees = useRef([]);

	const [employees, setEmployees] = useState([]);
	const [employee, setEmployee] = useState(null);
	const [departments, setDepartments] = useState(null);
	const [selectedDepartment, setSelectedDepartment] = useState(null);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Seznam zaměstnanců";
		document.getElementById("banner-desc").innerHTML = "Tvorba a správa zaměstnaneckých profilů";
		loadData();
	}, []);

	async function loadData() {
		const data = await getAll("employees");
		allEmployees.current = data;
		setEmployees(data);
	}

	async function filterEmployeesByDepartment(id, name) {
		const filteredEmployees = await allEmployees.current.filter((empl) => empl.departments.find((dep) => dep.department_id === id));
		setEmployees(filteredEmployees);
		setSelectedDepartment(name);
	}

	async function deleteHandler(id) {
		await remove("employees", id, setMessage, "Profil zaměstnance byl odstraněn", auth);
		loadData();
	}

	function deleteEmployee(id) {
		setAlert({ id: id, question: "Opravdu si přejete smazat profil zaměstnance?", positiveHandler: deleteHandler });
	}

	function resetFilter() {
		setEmployees(allEmployees.current);
		setSelectedDepartment(null);
	}

	return (
		<>
			<Departments
				departments={departments}
				setDepartments={setDepartments}
				refreshAllData={loadData}
				filterEmployeesByDepartment={filterEmployeesByDepartment}
			/>

			<FilterNotifier selectedCategory={selectedDepartment} resetHandler={resetFilter} />

			<section className="no-section">
				<ul className={css.employees}>
					{employees.length > 0 ? (
						employees.map((user) => (
							<EmployeeBasicInfo key={"employeeinfo-" + user.id} user={user} setEmployee={setEmployee} deleteEmployee={deleteEmployee} />
						))
					) : (
						<section>Nejsou vloženy žádné profily zaměstnanců</section>
					)}
				</ul>
			</section>

			<Employee employee={employee} setEmployee={setEmployee} getData={loadData} departments={departments} auth={auth} />

			<PlusButton onClick={() => setEmployee({})} />
		</>
	);
}
