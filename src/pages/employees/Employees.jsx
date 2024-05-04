import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PlusButton from "../../components/basic/PlusButton";
import ItemsController from "../../components/common/items-controller/ItemsController";
import useAuth from "../../hooks/useAuth";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import useInteraction from "../../hooks/useInteraction";
import useItemsControllerApiFunctions from "../../hooks/api/useItemsControllerApiFunctions";
import Departments from "./Departments";
import Employee from "./Employee";
import EmployeeBasicInfo from "./EmployeeBasicInfo";
import css from "./Employees.module.css";
import NoDataFound from "../../components/loaders/NoDataFound/NoDataFound";
import { getDepartments } from "../../modules/ApiEmployees";

export default function Employees() {
	const auth = useAuth();
	const { getAll, remove, getByCategory } = useBasicApiFunctions();
	const { searchByName } = useItemsControllerApiFunctions();
	const { setAlert } = useInteraction();
	const { t } = useTranslation("employees", "errors");

	const allEmployees = useRef([]);

	const [employee, setEmployee] = useState(null);
	const [selectedDepartment, setSelectedDepartment] = useState(null);

	const [searchedName, setSearchedName] = useState("");
	const { data: employees, refetch } = useQuery({
		queryKey: ["employees", selectedDepartment, searchedName],
		queryFn: async () => {
			let data;
			if (searchedName !== "") {
				data = await searchByName(
					"employees",
					searchedName,
					selectedDepartment
				);
			} else if (selectedDepartment) {
				data = await getByCategory("employees", selectedDepartment.id);
			} else {
				data = await getAll("employees");
				allEmployees.current = data;
			}
			return data;
		},
		meta: {
			errorMessage: t("errors:errorFetchEmployees"),
		},
	});

	const { data: departments } = useQuery({
		queryKey: ["departments"],
		queryFn: async () => {
			const data = await getDepartments();
			return data;
		},
		meta: {
			errorMessage: t("errors:errorFetchDepartments"),
		},
	});

	async function filterEmployeesByDepartment(id, name) {
		setSelectedDepartment({ id: id, name: name });
	}

	async function deleteHandler(id) {
		await remove("employees", id, t("positiveTextDelete"));
		refetch();
	}

	function deleteEmployee(id, name) {
		setAlert({
			id: id,
			question: t("alertDeleteEmployee", { name: name }),
			positiveHandler: deleteHandler,
		});
	}

	function resetFilter() {
		refetch();
		setSelectedDepartment(null);
	}

	return (
		<>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<Departments
				departments={departments}
				filterEmployeesByDepartment={filterEmployeesByDepartment}
			/>

			<ItemsController
				setSearchedName={setSearchedName}
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
					{employees?.length > 0 ? (
						employees.map((user) => (
							<EmployeeBasicInfo
								key={"employeeinfo-" + user.id}
								user={user}
								setEmployee={setEmployee}
								deleteEmployee={deleteEmployee}
							/>
						))
					) : (
						<NoDataFound text={t("noDataFound")} />
					)}
				</ul>
				<Employee
					employee={employee}
					setEmployee={setEmployee}
					getData={refetch}
					departments={departments}
					auth={auth}
				/>
			</section>

			<PlusButton onClick={() => setEmployee({})} />
		</>
	);
}
