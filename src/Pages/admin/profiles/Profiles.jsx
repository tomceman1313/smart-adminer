import { React, useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { getAll, edit, remove } from "../../modules/ApiFunctions";
import UserList from "./UserList";
import useInteraction from "../../Hooks/useInteraction";

import css from "./Profiles.module.css";

export default function Profiles() {
	const auth = useAuth();
	const { setMessage } = useInteraction();

	const [users, setUsers] = useState(null);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Správa profilů";
		document.getElementById("banner-desc").innerHTML = "Přehled a správa profilů";
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function loadData() {
		const data = await getAll("admin", auth);
		setUsers(data);
	}

	const deleteHandler = (id) => {
		remove("admin", id, setMessage, "Profil odstraněn", auth);
		let list = document.querySelector(`.${css.users} ul`);
		list.style.opacity = 1;
		loadData();
	};

	const handleEdit = (data) => {
		edit("admin", data, setMessage, "Profil byl upraven", auth);
		let list = document.querySelector(`.${css.users} ul`);
		list.style.opacity = 1;
		loadData();
	};

	return (
		<section className="no-section" style={{ position: "relative" }}>
			<div className={css.users}>{users && <UserList data={users} handleEdit={handleEdit} handleDelete={deleteHandler} css={css} />}</div>
		</section>
	);
}
