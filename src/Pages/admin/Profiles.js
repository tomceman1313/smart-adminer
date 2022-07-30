import { React, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import UserList from "./UserList";

import css from "./styles/Profiles.module.css";

export default function Profiles() {
	const [users, setUsers] = useState(null);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = () => {
		fetch("http://localhost:4300/api?class=admin&action=show")
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log(data);
				setUsers(data);
			});
	};

	const handleDelete = (id) => {
		fetch(`http://localhost:4300/api?class=admin&action=delete`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: id }),
		})
			.then((res) => {
				return res.json();
			})
			.then((message) => {
				console.log(message);
				loadData();
			});
	};

	return (
		<section>
			<h1>Uživatelské profily</h1>
			<div className={css.users}>{users && <UserList data={users} handleDelete={handleDelete} />}</div>
		</section>
	);
}
