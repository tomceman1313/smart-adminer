import "@splidejs/react-splide/css";
import { useState } from "react";
import { isPermitted } from "../../modules/BasicFunctions";
import cssBasic from "../styles/Basic.module.css";
import PrivilegeArticles from "./PrivilegeArticles";
import PrivilegeNews from "./PrivilegeNews";
import PrivilegePrices from "./PrivilegePrices";
import css from "./Register.module.css";

import { faAddressBook, faArrowUpWideShort, faBolt, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { editRole, getRoles } from "../../modules/ApiFunctions";

export default function Privileges({ privileges, setPrivileges }) {
	const auth = useAuth();

	const { register, handleSubmit } = useForm();
	const [showEditCont, setShowEditCont] = useState(false);
	const { setMessage } = useInteraction();

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
		<>
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
						<form onSubmit={handleSubmit(onSubmitRoles)}>
							<h2>Změna práv role</h2>
							<div className={cssBasic.input_box}>
								<select defaultValue={"default"} {...register("role")}>
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
								<select name="action" defaultValue={"default"} {...register("action")}>
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
								<select name="permission" {...register("permission")}>
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
		</>
	);
}
