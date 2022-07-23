import React from "react";
import css from "../styles/Login.module.css";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";

///http://localhost:4300/api?class=products

export default function Register() {
	const { register, handleSubmit } = useForm();
	const onSubmit = (data) => {
		console.log(JSON.stringify(data));
		fetch("http://localhost:4300/api?class=test", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})
			.then((response) => {
				console.log(response);
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
