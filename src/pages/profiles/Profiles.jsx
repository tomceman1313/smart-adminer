import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import warningToast from "../../components/common/warning-toast/WarningToast";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import UserList from "./UserList";

import css from "./Profiles.module.css";

export default function Profiles() {
	const { t } = useTranslation("profiles", "errors");

	const {
		checkNameAvailability,
		create,
		edit,
		getAllWithAuth,
		remove,
		getAll,
	} = useBasicApiFunctions();
	const [roles, setRoles] = useState(null);

	const { data: users, refetch } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const data = await getAllWithAuth("users");
			const _privileges = await getAll("users/roles");
			setRoles(_privileges);
			return data;
		},
		meta: {
			errorMessage: t("errors:errorFetchUsers"),
		},
	});

	async function deleteHandler(id) {
		await remove("users", id, t("deletePositiveText"));
		refetch();
	}

	async function submitHandler(data, previousUserName) {
		const isAvailable = await checkNameAvailability("users", data.username);
		if (previousUserName !== data.username && !isAvailable) {
			warningToast(t("messageUsernameIsTaken"));
			return;
		}

		data.username = data.username.replaceAll(" ", "_");

		if (previousUserName) {
			await edit("users", data, t("editPositiveText"));
		} else {
			if (data.password_check !== data.password) {
				warningToast(t("messagePasswordsNotEqual"));
				return;
			}
			await create("users", data, t("createPositiveText"));
		}

		refetch();
	}

	return (
		<div className="no-section" style={{ position: "relative" }}>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<div className={css.users}>
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
