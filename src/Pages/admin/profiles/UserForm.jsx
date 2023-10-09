import { faArrowUpWideShort, faAt, faIdBadge, faImagePortrait, faMobileScreen, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import css from "./Profiles.module.css";

import { useForm } from "react-hook-form";
import InputBox from "../../Components/basic/InputBox";
import Select from "../../Components/basic/select/Select";

const PRIVILEGES = [
	{ id: 1, name: "Uživatel" },
	{ id: 2, name: "Zaměstnanec" },
	{ id: 3, name: "Admin" },
];

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
					<h2>{userData.username}</h2>
					<FontAwesomeIcon
						id={css.close}
						icon={faXmark}
						onClick={() => {
							setState((prev) => !prev);
							reset();
						}}
					/>
					<form onSubmit={handleSubmit(onSubmit)}>
						<InputBox
							type="text"
							name="username"
							placeholder="Uživatelské jméno"
							defaultValue={userData.username}
							register={register}
							icon={faUser}
							isRequired={true}
						/>

						<InputBox
							type="text"
							name="fname"
							placeholder="Křestní jméno"
							defaultValue={userData.fname}
							register={register}
							icon={faImagePortrait}
							isRequired={true}
						/>

						<InputBox
							type="text"
							name="lname"
							placeholder="Příjmení"
							defaultValue={userData.lname}
							register={register}
							icon={faIdBadge}
							isRequired={true}
						/>

						<InputBox
							type="phone"
							name="tel"
							placeholder="Telefon"
							defaultValue={userData.tel}
							register={register}
							icon={faMobileScreen}
							isRequired={true}
						/>

						<InputBox type="email" name="email" placeholder="Email" defaultValue={userData.email} register={register} icon={faAt} isRequired={true} />

						<Select name="privilege" options={PRIVILEGES} register={register} defaultValue={userData.privilege} icon={faArrowUpWideShort} />

						<input type="hidden" defaultValue={userData.id} {...register("id")} />
						<input type="submit" />
					</form>
				</motion.section>
			)}
		</AnimatePresence>
	);
};

export default UserForm;
