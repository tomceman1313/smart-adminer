import { React, useEffect, useState } from "react";

import Alert from "../../Components/admin/Alert";
import UserList from "./UserList";
import CheckMessage from "../../Components/admin/CheckMessage";
import useAuth from "../../Hooks/useAuth";
import { getAll } from "../../modules/ApiFunctions";

import useApi from "../../Hooks/useApi";

import css from "./Profiles.module.css";

export default function Profiles() {
	const auth = useAuth();

	const [users, setUsers] = useState(null);
	const [alert, setAlert] = useState(null);
	const [check, setCheck] = useState(null);

	const deleteProfile = useApi("remove");
	const editProfile = useApi("edit");

	useEffect(() => {
		getAll("admin", setUsers, auth);
		document.getElementById("banner-title").innerHTML = "Správa profilů";
		document.getElementById("banner-desc").innerHTML = "Přehled a správa profilů";
	}, []);

	const handleDelete = (id) => {
		deleteProfile("admin", id, setAlert, "Profil odstraněn", "Profile se nepodařilo odstranit", auth);
		let list = document.querySelector(`.${css.users} ul`);
		list.style.opacity = 1;
		getAll("admin", setUsers, auth);
	};

	const handleEdit = (data) => {
		editProfile("admin", data, setAlert, "Profil byl upraven", "Profil se nepodařilo upravit", auth);
		let list = document.querySelector(`.${css.users} ul`);
		list.style.opacity = 1;
		getAll("admin", setUsers, auth);
	};

	return (
		<section className="no-section" style={{ position: "relative" }}>
			<div className={css.users}>{users && <UserList data={users} handleEdit={handleEdit} css={css} setCheckMessage={setCheck} />}</div>
			{alert && <Alert action={alert.action} text={alert.text} timeout={alert.timeout} setAlert={setAlert} />}
			{check && <CheckMessage id={check.id} question={"Opravdu chcete profil smazat?"} positiveHandler={handleDelete} setCheck={setCheck} />}
		</section>
	);
}
