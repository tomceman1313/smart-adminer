import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import PlusButton from "../../Components/basic/PlusButton";
import ItemsController from "../../Components/common/items-controller/ItemsController";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { getAll, remove } from "../../modules/ApiFunctions";
import Departments from "./Departments";
import Employee from "./Employee";
import EmployeeBasicInfo from "./EmployeeBasicInfo";
import css from "./Employees.module.css";
import { useTranslation } from "react-i18next";

export default function Employees() {
	const auth = useAuth();
	const { setMessage, setAlert } = useInteraction();
	const { t } = useTranslation("employees");

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
		setSelectedDepartment({ id: id, name: name });
	}

	async function deleteHandler(id) {
		await remove("employees", id, setMessage, t("positiveTextDelete"), auth);
		loadData();
	}

	function deleteEmployee(id, name) {
		setAlert({ id: id, question: t("alertDeleteEmployee", { name: name }), positiveHandler: deleteHandler });
	}

	function resetFilter() {
		setEmployees(allEmployees.current);
		setSelectedDepartment(null);
	}

	return (
		<>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<Departments
				departments={departments}
				setDepartments={setDepartments}
				refreshAllData={loadData}
				filterEmployeesByDepartment={filterEmployeesByDepartment}
			/>

			<ItemsController
				apiClass="employees"
				setState={setEmployees}
				selectedCategory={selectedDepartment}
				resetFilter={resetFilter}
				settingsConfig={{
					searchInput: t("placeholderSearchInput"),
					multiSelection: false,
					allItemsText: t("allEmployeesFilterText"),
				}}
			/>

			<section className="no-section">
				<ul className={css.employees}>
					{employees.length > 0 ? (
						employees.map((user) => (
							<EmployeeBasicInfo key={"employeeinfo-" + user.id} user={user} setEmployee={setEmployee} deleteEmployee={deleteEmployee} />
						))
					) : (
						<section>{t("noDataFound")}</section>
					)}
				</ul>
				<Employee employee={employee} setEmployee={setEmployee} getData={loadData} departments={departments} auth={auth} />
			</section>

			<PlusButton onClick={() => setEmployee({})} />
		</>
	);
}
