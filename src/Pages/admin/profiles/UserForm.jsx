import { faArrowUpWideShort, faAt, faIdBadge, faImagePortrait, faMobileScreen, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import cssInputs from "../styles/Basic.module.css";
import css from "./Profiles.module.css";

import { useForm } from "react-hook-form";

const UserForm = ({ userData, setState, handleEdit }) => {
	const { register, handleSubmit, reset } = useForm();

	const onSubmit = (data) => {
		handleEdit(data);
		setState(false);
	};

	return (
		<AnimatePresence>
			{userData && (
				<motion.section className={css.edit} initial={{ x: -600 }} animate={{ x: 0 }} exit={{ x: -600 }} transition={{ type: "spring", duration: 1 }}>
					<h2>{userData[0].username}</h2>
					<FontAwesomeIcon
						id={css.close}
						icon={faXmark}
						onClick={() => {
							setState((prev) => !prev);
							reset();
						}}
					/>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className={cssInputs.input_box}>
							<input type="text" placeholder="Uživatelské jméno" {...register("username")} defaultValue={userData[0].username} />
							<FontAwesomeIcon className={cssInputs.icon} icon={faUser} />
						</div>

						<div className={cssInputs.input_box}>
							<input type="text" placeholder="Jméno" {...register("fname")} defaultValue={userData[0].fname} />
							<FontAwesomeIcon className={cssInputs.icon} icon={faImagePortrait} />
						</div>

						<div className={cssInputs.input_box}>
							<input type="text" placeholder="Příjmení" {...register("lname")} defaultValue={userData[0].lname} />
							<FontAwesomeIcon className={cssInputs.icon} icon={faIdBadge} />
						</div>

						<div className={cssInputs.input_box}>
							<input type="phone" placeholder="Telefon" {...register("tel")} defaultValue={userData[0].tel} />
							<FontAwesomeIcon className={cssInputs.icon} icon={faMobileScreen} />
						</div>

						<div className={cssInputs.input_box}>
							<input type="email" placeholder="Email" {...register("email")} defaultValue={userData[0].email} />
							<FontAwesomeIcon className={cssInputs.icon} icon={faAt} />
						</div>

						<div className={cssInputs.input_box}>
							<select defaultValue={userData[0].privilege} {...register("privilege")}>
								<option value="default" disabled>
									-- Práva nového účtu --
								</option>
								<option value="1">Uživatel</option>
								<option value="2">Zaměstnanec</option>
								<option value="3">Admin</option>
							</select>
							<FontAwesomeIcon className={cssInputs.icon} icon={faArrowUpWideShort} />
						</div>

						<input type="hidden" defaultValue={userData[0].id} {...register("id")} />

						<input type="submit" />
					</form>
				</motion.section>
			)}
		</AnimatePresence>
	);
};

export default UserForm;
