import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import PlusButton from "../../Components/basic/PlusButton";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { getAll, getDepartments, remove } from "../../modules/ApiEmployees";
import Employee from "./Employee";
import EmployeeBasicInfo from "./EmployeeBasicInfo";
import css from "./Employees.module.css";
import Departments from "./Departments";

export default function Employees() {
	const auth = useAuth();
	const { setMessage, setAlert } = useInteraction();
	const [employees, setEmployees] = useState([]);
	const [employee, setEmployee] = useState(null);
	const [isEmployeeContVisible, setIsEmployeeContVisible] = useState(false);
	const [departments, setDepartments] = useState(null);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Seznam zaměstnanců";
		document.getElementById("banner-desc").innerHTML = "Tvorba a správa zaměstnaneckých profilů";
		getData();
	}, []);

	async function getData() {
		const data = await getAll();
		setEmployees(data);

		const departmentsData = await getDepartments();
		setDepartments(departmentsData);
	}

	function newEmployee() {
		setIsEmployeeContVisible([]);
	}

	async function deleteHandler(id) {
		await remove(id, auth, setMessage);
		getData();
	}

	function deleteEmployee(id) {
		setAlert({ id: id, question: "Opravdu si přejete smazat profil zaměstnance?", positiveHandler: deleteHandler });
	}

	return (
		<>
			<Departments
				employees={employees}
				setEmployees={setEmployees}
				departments={departments}
				setDepartments={setDepartments}
				refreshAllData={getData}
			/>

			<section className="no-section">
				<ul className={css.employees}>
					{employees !== [] ? (
						employees.map((user) => (
							<EmployeeBasicInfo
								key={"employeeinfo-" + user.id}
								user={user}
								setEmployee={setEmployee}
								deleteEmployee={deleteEmployee}
								setIsEmployeeContVisible={setIsEmployeeContVisible}
							/>
						))
					) : (
						<section>Nejsou vloženy žádné profily zaměstnanců</section>
					)}
				</ul>
			</section>

			<AnimatePresence>
				{isEmployeeContVisible && (
					<Employee employee={employee} getData={getData} setVisible={setIsEmployeeContVisible} departments={departments} auth={auth} />
				)}
			</AnimatePresence>

			<PlusButton onClick={newEmployee} />
		</>
	);
}
