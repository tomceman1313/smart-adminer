import { React, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import useAuth from "../../hooks/useAuth";
import useInteraction from "../../hooks/useInteraction";
import { checkNameAvailability, create, edit, getAllWithAuth, remove, getAll } from "../../modules/ApiFunctions";
import css from "./Profiles.module.css";
import UserList from "./UserList";
import { useTranslation } from "react-i18next";

export default function Profiles() {
	const auth = useAuth();
	const { setMessage } = useInteraction();
	const { t } = useTranslation("profiles");

	const [users, setUsers] = useState(null);
	const [roles, setRoles] = useState(null);

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function loadData() {
		const data = await getAllWithAuth("users", auth);
		const _privileges = await getAll("users/roles");
		setRoles(_privileges);
		setUsers(data);
	}

	async function deleteHandler(id) {
		await remove("users", id, setMessage, t("deletePositiveText"), auth);
		loadData();
	}

	async function submitHandler(data, previousUserName) {
		const isAvailable = await checkNameAvailability("users", data.username);
		if (previousUserName !== data.username && !isAvailable) {
			setMessage({ action: "alert", text: t("messageUsernameIsTaken") });
			return false;
		}

		data.username = data.username.replaceAll(" ", "_");

		if (previousUserName) {
			await edit("users", data, setMessage, t("editPositiveText"), auth);
		} else {
			if (data.password_check !== data.password) {
				setMessage({ action: "alert", text: t("messagePasswordsNotEqual") });
				return false;
			}
			create("users", data, setMessage, t("createPositiveText"), auth);
		}

		loadData();
		return true;
	}

	return (
		<div className="no-section" style={{ position: "relative" }}>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<div className={css.users}>{users && <UserList users={users} roles={roles} submitHandler={submitHandler} deleteHandler={deleteHandler} />}</div>
		</div>
	);
}
