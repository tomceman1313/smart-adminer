import { React, useEffect, useState } from "react";

import Alert from "../../Components/admin/Alert";
import UserList from "../../Components/admin/UserList";

import css from ".//Profiles.module.css";

export default function Profiles() {
	const [users, setUsers] = useState(null);
	const [alert, setAlert] = useState(null);

	useEffect(() => {
		loadData();
		document.getElementById("banner-title").innerHTML = "Správa profilů";
		document.getElementById("banner-desc").innerHTML = "Přehled a správa profilů";
	}, []);

	const loadData = () => {
		fetch("http://localhost:4300/api?class=admin&action=show")
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				setUsers(data);
			});
	};

	const handleDelete = (id) => {
		fetch(`http://localhost:4300/api?class=admin&action=delete`, {
			method: "DELETE",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			body: JSON.stringify({ id: id }),
		})
			.then((res) => {
				return res.json();
			})
			.then((message) => {
				//console.log(message);
				setAlert({ action: "success", text: "Profil by úspěšně smazán", timeout: 6000 });
				loadData();
			});
	};

	const handleEdit = (data) => {
		fetch(`http://localhost:4300/api?class=admin&action=edit`, {
			method: "PATCH",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			body: JSON.stringify(data),
		})
			.then((res) => {
				return res.json();
			})
			.then((message) => {
				//console.log(message);
				setAlert({ action: "success", text: "Uloženo", timeout: 6000 });
				let list = document.querySelector(`.${css.users} ul`);
				list.style.opacity = 1;
				loadData();
			});
	};

	return (
		<section className="no-section" style={{ position: "relative" }}>
			<div className={css.users}>{users && <UserList data={users} handleDelete={handleDelete} handleEdit={handleEdit} css={css} />}</div>
			{alert && <Alert action={alert.action} text={alert.text} timeout={alert.timeout} setAlert={setAlert} />}
		</section>
	);
}
