import React from "react";
import css from "./styles/Login.module.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
	const { register, handleSubmit } = useForm();
	let navigate = useNavigate();
	const onSubmit = (data) => {
		console.log(JSON.stringify(data));
		fetch("http://localhost:4300/api?class=admin&action=verify", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})
			.then((response) => {
				//console.log(response);
				response.text().then((_data) => {
					let data = JSON.parse(_data);
					console.log(data);
					if (data.message === "success") {
						navigate("/dashboard");
					} else {
						alert("wrong");
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
		</div>
	);
}
