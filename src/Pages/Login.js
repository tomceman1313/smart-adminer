import { useState, useContext } from "react";
import AuthContext from "./context/AuthContext";
import css from "./styles/Login.module.css";

import Alert from "./Components/admin/Alert";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
	const { register, handleSubmit } = useForm();
	const [alert, setAlert] = useState(null);

	let navigate = useNavigate();
	const auth = useContext(AuthContext);

	const onSubmit = (data) => {
		fetch("http://localhost:4300/api?class=admin&action=auth", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			credentials: "include",
			body: JSON.stringify(data),
		})
			.then((response) => {
				response.text().then((_data) => {
					let data = JSON.parse(_data);
					if (data.message === "access") {
						auth.setUserInfo({ role: data.role, username: data.username });
						//sessionStorage.setItem("refresh_token", data.refresh_token);
						navigate("/dashboard");
					} else {
						setAlert(true);
					}
				});
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return;
			})
			.catch((error) => {
				console.error("There has been a problem with your fetch operation:", error);
			});

		// fetch("http://localhost:4300/api?class=admin&action=create_cookie", {
		// 	method: "GET",
		// 	credentials: "include",
		// })
		// 	.then((response) => {
		// 		response.text().then((_data) => {
		// 			let data = JSON.parse(_data);
		// 			console.log(data);
		// 		});
		// 		if (!response.ok) {
		// 			throw new Error("Network response was not ok");
		// 		}
		// 		return;
		// 	})
		// 	.catch((error) => {
		// 		console.error("There has been a problem with your fetch operation:", error);
		// 	});
	};

	return (
		<div className={css.login}>
			<section>
				<h2>PŘIHLÁŠENÍ</h2>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className={css.input_box}>
						<input type="text" placeholder="Uživatelské jméno" {...register("username")} />
						<FontAwesomeIcon className={css.icon} icon={faUser} />
					</div>
					<div className={css.input_box}>
						<input type="password" placeholder="Heslo" {...register("password")} />
						<FontAwesomeIcon className={css.icon} icon={faLock} />
					</div>
					<input type="submit" />
				</form>
			</section>
			{alert && <Alert action="failure" text="Přihlašovací údaje nejsou správné" timeout={6000} setAlert={setAlert} />}
		</div>
	);
}
