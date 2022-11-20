import React, { useEffect, useState } from "react";
import cssBasic from "../styles/Basic.module.css";
import css from "./Profile.module.css";

import Alert from "../../Components/admin/Alert";

import { getUserData } from "../../modules/ApiFunctions";
import useAuth from "../../Hooks/useAuth";

import { faAt, faIdBadge, faImagePortrait, faMobileScreen, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const Profile = () => {
	const auth = useAuth();

	const [alert, setAlert] = useState(null);
	const [userInfo, setUserInfo] = useState({});
	const [editInfo, setEditInfo] = useState(false);

	const { register: registerUserInfo, handleSubmit: handleSubmitUserInfo, setValue, setFocus } = useForm();

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Správa profilu";
		document.getElementById("banner-desc").innerHTML = "Přehled a správa uživatelského profilu";
		getUserInfo();
	}, []);

	async function getUserInfo() {
		const data = await getUserData(auth);
		const userData = data.data;

		setUserInfo(userData);
		setValue("username", userData.username);
		setValue("fname", userData.fname);
		setValue("lname", userData.lname);
		setValue("tel", userData.tel);
		setValue("email", userData.email);
		setValue("id", userData.id);
	}

	const onSumbitUserInfo = (data) => {
		if (!editInfo) {
			setFocus("username");
			document.getElementById("submit").innerHTML = "Uložit";
			setEditInfo(!editInfo);
			return;
		}

		document.getElementById("submit").innerHTML = "Upravit";
		setEditInfo(!editInfo);

		fetch("http://localhost:4300/api?class=admin&action=update", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			body: JSON.stringify({ token: auth.userInfo.token, data: data }),
		}).then((response) => {
			if (response.status === 201) {
				setAlert({ action: "success", text: "Uloženo", timeout: 6000 });
				getUserInfo();
			}
		});
	};

	return (
		<div className={css.profile}>
			<section className={css.user_info}>
				<form onSubmit={handleSubmitUserInfo(onSumbitUserInfo)}>
					<h2>Uživatelské údaje</h2>
					<div className={cssBasic.input_box}>
						<input type="text" placeholder="Uživatelské jméno" {...registerUserInfo("username")} autoComplete="new-password" readOnly={!editInfo} />
						<FontAwesomeIcon className={cssBasic.icon} icon={faUser} />
					</div>

					<div className={cssBasic.input_box}>
						<input type="text" placeholder="Jméno" {...registerUserInfo("fname")} autoComplete="new-password" readOnly={!editInfo} />
						<FontAwesomeIcon className={cssBasic.icon} icon={faImagePortrait} />
					</div>

					<div className={cssBasic.input_box}>
						<input type="text" placeholder="Příjmení" {...registerUserInfo("lname")} autoComplete="new-password" readOnly={!editInfo} />
						<FontAwesomeIcon className={cssBasic.icon} icon={faIdBadge} />
					</div>

					<div className={cssBasic.input_box}>
						<input type="phone" placeholder="Telefon" {...registerUserInfo("tel")} autoComplete="new-password" readOnly={!editInfo} />
						<FontAwesomeIcon className={cssBasic.icon} icon={faMobileScreen} />
					</div>

					<div className={cssBasic.input_box}>
						<input type="email" placeholder="Email" {...registerUserInfo("email")} autoComplete="new-password" readOnly={!editInfo} />
						<FontAwesomeIcon className={cssBasic.icon} icon={faAt} />
					</div>
					<input type="hidden" {...registerUserInfo("id")} />
					<button type="button">Změnit heslo</button>
					<button type="submit" id="submit">
						Upravit
					</button>
				</form>
			</section>
			{alert && <Alert action={alert.action} text={alert.text} timeout={alert.timeout} setAlert={setAlert} />}
		</div>
	);
};

export default Profile;
