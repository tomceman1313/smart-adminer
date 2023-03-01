import { React, useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { getAll } from "../../modules/ApiFunctions";
import UserList from "./UserList";

import useApi from "../../Hooks/useApi";
import useInteraction from "../../Hooks/useInteraction";

import css from "./Profiles.module.css";

export default function Profiles() {
	const auth = useAuth();
	const { setMessage } = useInteraction();

	const [users, setUsers] = useState(null);

	const deleteProfile = useApi("remove");
	const editProfile = useApi("edit");

	useEffect(() => {
		getAll("admin", setUsers, auth);
		document.getElementById("banner-title").innerHTML = "Správa profilů";
		document.getElementById("banner-desc").innerHTML = "Přehled a správa profilů";
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const remove = (id) => {
		deleteProfile("admin", id, setMessage, "Profil odstraněn", "Profile se nepodařilo odstranit", auth);
		let list = document.querySelector(`.${css.users} ul`);
		list.style.opacity = 1;
		getAll("admin", setUsers, auth);
	};

	const handleEdit = (data) => {
		editProfile("admin", data, setMessage, "Profil byl upraven", "Profil se nepodařilo upravit", auth);
		let list = document.querySelector(`.${css.users} ul`);
		list.style.opacity = 1;
		getAll("admin", setUsers, auth);
	};

	return (
		<section className="no-section" style={{ position: "relative" }}>
			<div className={css.users}>{users && <UserList data={users} handleEdit={handleEdit} handleDelete={remove} css={css} />}</div>
		</section>
	);
}
