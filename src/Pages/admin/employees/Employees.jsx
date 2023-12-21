import { useEffect, useRef, useState } from "react";
import PlusButton from "../../Components/basic/PlusButton";
import FilterNotifier from "../../Components/common/filter-notifier/FilterNotifier";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { getAll, remove } from "../../modules/ApiFunctions";
import Departments from "./Departments";
import Employee from "./Employee";
import EmployeeBasicInfo from "./EmployeeBasicInfo";
import { Helmet } from "react-helmet-async";
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

	function deleteEmployee(id, name) {
		setAlert({ id: id, question: `Opravdu si přejete smazat profil zaměstnance ${name}?`, positiveHandler: deleteHandler });
	}

	function resetFilter() {
		setEmployees(allEmployees.current);
		setSelectedDepartment(null);
	}

	return (
		<>
			<Helmet>
				<title>Zaměstnanci | SmartAdminer</title>
			</Helmet>
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
				<Employee employee={employee} setEmployee={setEmployee} getData={loadData} departments={departments} auth={auth} />
			</section>

			<PlusButton onClick={() => setEmployee({})} />
		</>
	);
}
