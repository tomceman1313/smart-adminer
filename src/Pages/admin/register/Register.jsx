import "@splidejs/react-splide/css";
import { useEffect, useState } from "react";
import { isPermitted } from "../../modules/BasicFunctions";
import cssBasic from "../styles/Basic.module.css";
import PrivilegeArticles from "./PrivilegeArticles";
import PrivilegeNews from "./PrivilegeNews";
import PrivilegePrices from "./PrivilegePrices";
import css from "./Register.module.css";

import {
	faAddressBook,
	faArrowUpWideShort,
	faAt,
	faBolt,
	faIdBadge,
	faImagePortrait,
	faLock,
	faMobileScreen,
	faUnlock,
	faUser,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useForm } from "react-hook-form";
import { create, getRoles, editRole } from "../../modules/ApiFunctions";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import InputBox from "../../Components/basic/InputBox";
import Select from "../../Components/basic/select/Select";

export default function Register() {
	const auth = useAuth();

	const { register, handleSubmit, reset } = useForm();
	const { register: registerUpdateRole, handleSubmit: handleRoleUpdate } = useForm();

	const [privileges, setPrivileges] = useState(null);
	const [showEditCont, setShowEditCont] = useState(false);
	const { setMessage } = useInteraction();

	useEffect(() => {
		getRoles(setPrivileges, auth);

		document.getElementById("banner-title").innerHTML = "Registrace a role";
		document.getElementById("banner-desc").innerHTML = "Tvorba nových profilů, přehled a správa práv rolí";
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = (data) => {
		if (data.password_check !== data.password) {
			setMessage({ action: "alert", text: "Hesla nejsou stejná." });
			return;
		}
		create("admin", data, setMessage, "Účet vytvořen", auth);
		reset();
	};

	const onSubmitRoles = (data) => {
		editRole(data, setMessage, "Práva byla upravena", auth);
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
				<form onSubmit={handleSubmit(onSubmit)}>
					<InputBox type="text" name="username" placeholder="Uživatelské jméno" register={register} icon={faUser} isRequired={true} />
					<InputBox type="text" name="fname" placeholder="Křestní jméno" register={register} icon={faImagePortrait} isRequired={true} />
					<InputBox type="text" name="lname" placeholder="Příjmení" register={register} icon={faIdBadge} isRequired={true} />
					<InputBox type="phone" name="tel" placeholder="Telefon" register={register} icon={faMobileScreen} isRequired={true} />
					<InputBox type="email" name="email" placeholder="Email" register={register} icon={faAt} isRequired={true} />
					<InputBox type="password" name="password" placeholder="Heslo" register={register} icon={faUnlock} isRequired={true} />
					<InputBox type="password" name="password_check" placeholder="Heslo znovu" register={register} icon={faLock} isRequired={true} />

					{privileges && (
						<Select
							name="privilege"
							options={privileges.map((item) => ({ id: item.role, name: item.name }))}
							register={register}
							icon={faArrowUpWideShort}
						/>
					)}

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
					>
						<SplideSlide className={css.slide}>
							<PrivilegePrices css={css} privileges={privileges} isPermitted={isPermitted} />
						</SplideSlide>
						<SplideSlide className={css.slide}>
							<PrivilegeArticles css={css} privileges={privileges} isPermitted={isPermitted} />
						</SplideSlide>

						<SplideSlide className={css.slide}>
							<PrivilegeNews css={css} privileges={privileges} isPermitted={isPermitted} />
						</SplideSlide>
					</Splide>
					<button id={css.btnEditRoles} onClick={editRoles}>
						Změnit práva
					</button>

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
		</div>
	);
}
