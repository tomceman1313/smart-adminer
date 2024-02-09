import { React, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { checkNameAvailability, create, edit, getAllWithAuth, remove, getAll } from "../../modules/ApiFunctions";
import css from "./Profiles.module.css";
import UserList from "./UserList";

export default function Profiles() {
	const auth = useAuth();
	const { setMessage } = useInteraction();

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
		await remove("users", id, setMessage, "Profil odstraněn", auth);
		loadData();
	}

	async function submitHandler(data, previousUserName) {
		const isAvailable = await checkNameAvailability("users", data.username);
		if (previousUserName !== data.username && !isAvailable) {
			setMessage({ action: "alert", text: "Zvolené uživatelské jméno je již obsazené" });
			return false;
		}

		data.username = data.username.replaceAll(" ", "_");

		if (previousUserName) {
			await edit("users", data, setMessage, "Profil byl upraven", auth);
		} else {
			if (data.password_check !== data.password) {
				setMessage({ action: "alert", text: "Hesla nejsou stejná." });
				return false;
			}
			console.log(data);
			create("users", data, setMessage, "Účet vytvořen", auth);
		}

		loadData();
		return true;
	}

	return (
		<section className="no-section" style={{ position: "relative" }}>
			<Helmet>
				<title>Správa profilu | SmartAdminer</title>
			</Helmet>
			<div className={css.users}>{users && <UserList users={users} roles={roles} submitHandler={submitHandler} deleteHandler={deleteHandler} />}</div>
		</section>
	);
}
