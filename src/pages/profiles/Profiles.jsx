import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import warningToast from "../../components/common/warning-toast/WarningToast";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import { useAuthGetAll, useDelete, useGetAll } from "../../hooks/api/useCRUD";
import UserList from "./UserList";

export default function Profiles() {
	const { t } = useTranslation("profiles", "errors");

	const { checkNameAvailability, create, edit } = useBasicApiFunctions();

	const { data: users, refetch } = useAuthGetAll(
		"users",
		null,
		["users"],
		t("errors:errorFetchUsers")
	);

	const { data: roles } = useGetAll(
		"users/roles",
		null,
		["privileges"],
		t("errors:errorFetchUsers")
	);

	const { mutateAsync: deleteUser } = useDelete(
		"users",
		t("deletePositiveText"),
		t("errors:errorCRUDOperation"),
		["users"]
	);

	async function deleteHandler(id) {
		await deleteUser(id);
	}

	async function submitHandler(data, previousUserName) {
		const isAvailable = await checkNameAvailability("users", data.username);
		if (previousUserName !== data.username && !isAvailable) {
			warningToast(t("messageUsernameIsTaken"));
			return false;
		}

		data.username = data.username.replaceAll(" ", "_");

		if (previousUserName) {
			await edit("users", data, t("editPositiveText"));
		} else {
			if (data.password_check !== data.password) {
				warningToast(t("messagePasswordsNotEqual"));
				return false;
			}
			await create("users", data, t("createPositiveText"));
		}

		refetch();
		return true;
	}

	return (
		<div className="no-section" style={{ position: "relative" }}>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<div>
				{users && roles && (
					<UserList
						users={users}
						roles={roles}
						submitHandler={submitHandler}
						deleteHandler={deleteHandler}
					/>
				)}
			</div>
		</div>
	);
}
