import useAuth from "./Hooks/useAuth";
import useInteraction from "./Hooks/useInteraction";
import css from "./styles/Login.module.css";

import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import Message from "./Components/admin/Message";
import InputBox from "./Components/basic/InputBox";
import { BASE_URL } from "./modules/ApiFunctions";
import { Helmet } from "react-helmet-async";

export default function Login() {
	const { register, handleSubmit } = useForm();
	const { setMessage } = useInteraction();

	const navigate = useNavigate();
	const location = useLocation();
	let from = location?.state?.from || "/";

	const auth = useAuth();

	async function onSubmit(data) {
		const response = await fetch(BASE_URL + "/api/?class=admin&action=auth", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			credentials: "include",
			body: JSON.stringify(data),
		});

		const _data = await response.json();

		if (_data.message === "access") {
			auth.setUserInfo({ role: _data.role, username: _data.username, token: _data.token, id: _data.id });
			navigate(from, { state: { from: location }, replace: true });
			return;
		}

		setMessage({ action: "alert", text: "Přihlašovací údaje nejsou správné" });
	}

	return (
		<div className={css.login}>
			<Helmet>
				<title>Přihlášení | SmartAdminer</title>
			</Helmet>
			<section>
				<h2>PŘIHLÁŠENÍ</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					<InputBox type="text" name="username" register={register} placeholder="Uživatelské jméno" icon={faUser} isRequired={true} />
					<InputBox type="password" name="password" register={register} placeholder="Heslo" icon={faLock} isRequired={true} />
					<input type="submit" />
				</form>
			</section>
			<Message />
		</div>
	);
}
