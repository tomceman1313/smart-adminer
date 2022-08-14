import { React, useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";

import UserList from "./UserList";

import css from "./styles/Profiles.module.css";

export default function Profiles() {
	const [users, setUsers] = useState(null);
	const [change, setChange] = useState(false);

	useEffect(() => {
		loadData();
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
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id: id }),
		})
			.then((res) => {
				return res.json();
			})
			.then((message) => {
				//console.log(message);
				setChange("odstraněn");
				loadData();
			});
	};

	const handleEdit = (data) => {
		fetch(`http://localhost:4300/api?class=admin&action=edit`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})
			.then((res) => {
				return res.json();
			})
			.then((message) => {
				//console.log(message);
				setChange("upraven");
				loadData();
			});
	};

	const ChangeNotifier = () => {
		setTimeout(() => {
			setChange(false);
		}, 6000);

		return (
			<div className={css.notifier}>
				<FontAwesomeIcon icon={faSquareCheck} />
				<label>{`Záznam by ${change}`}</label>
			</div>
		);
	};

	return (
		<section style={{ position: "relative" }}>
			<h1>Uživatelské profily</h1>
			<div className={css.users}>{users && <UserList data={users} handleDelete={handleDelete} handleEdit={handleEdit} css={css} />}</div>
			{change && <ChangeNotifier type={change} />}
		</section>
	);
}
