import { useEffect, useState } from "react";
import css from "./Register.module.css";
import cssBasic from "../styles/Basic.module.css";
import "@splidejs/react-splide/css";
import Alert from "../../Components/admin/Alert";

import { isPermitted } from "../../modules/BasicFunctions";

import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faIdBadge, faImagePortrait, faMobileScreen, faAt, faUnlock, faArrowUpWideShort, faAddressBook, faBolt, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import useAuth from "../../Hooks/useAuth";
import useApi from "../../Hooks/useApi";
import useRolesApi from "../../Hooks/useRolesApi";

export default function Register() {
	const auth = useAuth();
	const getRoles = useRolesApi("getroles");
	const createUser = useApi("create");
	const editRole = useRolesApi("update_role");

	const { register, handleSubmit } = useForm();
	const { register: registerUpdateRole, handleSubmit: handleRoleUpdate } = useForm();

	const [privileges, setPrivileges] = useState(null);
	const [showEditCont, setShowEditCont] = useState(false);
	const [alert, setAlert] = useState(null);

	useEffect(() => {
		getRoles(setPrivileges, auth);

		document.getElementById("banner-title").innerHTML = "Registrace a role";
		document.getElementById("banner-desc").innerHTML = "Tvorba nových profilů, přehled a správa práv rolí";
	}, []);

	const onSubmit = (data) => {
		createUser("admin", data, setAlert, "Účet vytvořen", "Účet nebyl vytvořen", auth);
	};

	const onSubmitRoles = (data) => {
		editRole(data, setAlert, "Práva byla upravena", "Práva nebyla upravena", auth);
		getRoles(setPrivileges, auth);
		editRoles();
	};

	const editRoles = () => {
		const cont = document.querySelector(`.${css.edit_roles}`);
		if (showEditCont) {
			cont.classList.remove(css.show_roles_edit);
		} else {
			cont.classList.add(css.show_roles_edit);
		}
		setShowEditCont(!showEditCont);
	};

	return (
		<div className={css.register}>
			<section>
				<h2>Nový uživatel</h2>
				<form onSubmit={handleSubmit(onSubmit)} autoComplete="new-password">
					<div className={cssBasic.input_box}>
						<input type="text" placeholder="Uživatelské jméno" {...register("username")} autoComplete="off" />
						<FontAwesomeIcon className={cssBasic.icon} icon={faUser} />
					</div>

					<div className={cssBasic.input_box}>
						<input type="text" placeholder="Jméno" {...register("fname")} autoComplete="off" />
						<FontAwesomeIcon className={cssBasic.icon} icon={faImagePortrait} />
					</div>

					<div className={cssBasic.input_box}>
						<input type="text" placeholder="Příjmení" {...register("lname")} autoComplete="off" />
						<FontAwesomeIcon className={cssBasic.icon} icon={faIdBadge} />
					</div>

					<div className={cssBasic.input_box}>
						<input type="phone" placeholder="Telefon" {...register("tel")} autoComplete="off" />
						<FontAwesomeIcon className={cssBasic.icon} icon={faMobileScreen} />
					</div>

					<div className={cssBasic.input_box}>
						<input type="email" placeholder="Email" {...register("email")} autoComplete="off" />
						<FontAwesomeIcon className={cssBasic.icon} icon={faAt} />
					</div>

					<div className={cssBasic.input_box}>
						<input type="password" placeholder="Heslo" {...register("password")} autoComplete="off" />
						<FontAwesomeIcon className={cssBasic.icon} icon={faUnlock} />
					</div>

					<div className={cssBasic.input_box}>
						<input type="password" placeholder="Heslo znovu" {...register("password_check")} autoComplete="off" />
						<FontAwesomeIcon className={cssBasic.icon} icon={faLock} />
					</div>

					<div className={cssBasic.input_box}>
						<select defaultValue={"default"} {...register("privilege")}>
							<option value="default" disabled>
								-- Práva nového účtu --
							</option>
							<option value="1">Uživatel</option>
							<option value="2">Zaměstnanec</option>
							<option value="3">Admin</option>
						</select>
						<FontAwesomeIcon className={cssBasic.icon} icon={faArrowUpWideShort} />
					</div>
					<input type="submit" />
				</form>
			</section>

			{privileges && (
				<section>
					<h2>Práva rolí</h2>

					<Splide
						options={{
							perPage: 1,
							height: "auto",
							rewind: true,
						}}
						aria-labelledby="basic-example-heading"
						onMoved={(splide, newIndex) => {
							// eslint-disable-next-line
							console.log("moved", newIndex);

							// eslint-disable-next-line
							console.log("length", splide.length);
						}}
					>
						<SplideSlide className={css.slide}>
							<div className={css.roles}>
								<h3>Články</h3>
								<table>
									<thead>
										<tr>
											<th>Role</th>
											<th>Vytvoření</th>
											<th>Editace</th>
											<th>Publikování</th>
										</tr>
									</thead>

									<tbody>
										{privileges.map((role) => (
											<tr key={role.role}>
												<td>{role.name}</td>
												<td>{isPermitted(role.create_articles)}</td>
												<td>{isPermitted(role.edit_articles)}</td>
												<td>{isPermitted(role.post_articles)}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</SplideSlide>
						<SplideSlide className={css.slide}>
							<div className={css.roles}>
								<h3>Ceny</h3>

								<table>
									<thead>
										<tr>
											<th>Role</th>
											<th>Změnit</th>
											<th>Vytvořit položku</th>
										</tr>
									</thead>

									<tbody>
										{privileges.map((role) => (
											<tr key={role.role}>
												<td>{role.name}</td>
												<td>{isPermitted(role.edit_prices)}</td>
												<td>{isPermitted(role.create_pricelist_item)}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</SplideSlide>

						<SplideSlide className={css.slide}>
							<div className={css.roles}>
								<h3>Aktuality</h3>
								<table>
									<thead>
										<tr>
											<th>Role</th>
											<th>Vytvoření</th>
											<th>Editace</th>
											<th>Publikování</th>
										</tr>
									</thead>
									<tbody>
										{privileges.map((role) => (
											<tr key={role.role}>
												<td>{role.name}</td>
												<td>{isPermitted(role.create_news)}</td>
												<td>{isPermitted(role.edit_news)}</td>
												<td>{isPermitted(role.post_news)}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</SplideSlide>
					</Splide>
					<button onClick={editRoles}>Změnit práva</button>

					<div className={css.edit_roles}>
						<FontAwesomeIcon id={css.close} icon={faXmark} onClick={editRoles} />
						<form onSubmit={handleRoleUpdate(onSubmitRoles)}>
							<h2>Změna práv role</h2>
							<div className={cssBasic.input_box}>
								<select defaultValue={"default"} {...registerUpdateRole("role")}>
									<option value="default" disabled>
										-- Vyberte roli --
									</option>
									{privileges.map((role) => (
										<option key={role.role} value={role.role}>
											{role.name}
										</option>
									))}
								</select>
								<FontAwesomeIcon className={cssBasic.icon} icon={faAddressBook} />
							</div>

							<div className={cssBasic.input_box}>
								<select name="action" defaultValue={"default"} {...registerUpdateRole("action")}>
									<option value="default" disabled>
										-- Zvolte akci --
									</option>
									<option value="create_articles">Vytvoření článku</option>
									<option value="edit_articles">Editace článků</option>
									<option value="post_articles">Publikování článků</option>
									<option value="edit_prices">Změna cen</option>
									<option value="create_pricelist_item">Vytvoření nové položky ceníku</option>
									<option value="create_news">Vytvoření novinky</option>
									<option value="edit_news">Editace novinky</option>
									<option value="post_news">Publikování novinky</option>
								</select>
								<FontAwesomeIcon className={cssBasic.icon} icon={faBolt} />
							</div>

							<div className={cssBasic.input_box}>
								<select name="permission" {...registerUpdateRole("permission")}>
									<option value="1">Povolit</option>
									<option value="0">Zamítnout</option>
								</select>
								<FontAwesomeIcon className={cssBasic.icon} icon={faArrowUpWideShort} />
							</div>

							<button type="submit">Uložit</button>
						</form>
					</div>
				</section>
			)}
			{alert && <Alert action={alert.action} text={alert.text} timeout={alert.timeout} setAlert={setAlert} />}
		</div>
	);
}