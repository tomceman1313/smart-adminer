import {
	faArrowUpWideShort,
	faAt,
	faIdBadge,
	faImagePortrait,
	faMobileScreen,
	faUser,
	faXmark,
	faUnlock,
	faLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import css from "./Profiles.module.css";

import { useForm } from "react-hook-form";
import InputBox from "../../components/basic/InputBox";
import Select from "../../components/basic/select/Select";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const UserForm = ({ userData, roles, close, submitHandler }) => {
	const { register, handleSubmit, reset } = useForm();
	const { t } = useTranslation("profiles");

	useEffect(() => {
		reset();
	}, [userData, reset]);

	async function onSubmit(data) {
		const result = await submitHandler(data, userData.username);
		if (result) {
			close();
		}
	}

	return (
		<AnimatePresence>
			{userData && (
				<motion.section className={css.edit} initial={{ x: -600 }} animate={{ x: 0 }} exit={{ x: -600 }} transition={{ type: "spring", duration: 1 }}>
					<h2>{userData?.username ? userData.username : t("formHeader")}</h2>
					<FontAwesomeIcon id={css.close} icon={faXmark} onClick={close} />
					<form onSubmit={handleSubmit(onSubmit)}>
						<InputBox
							type="text"
							name="username"
							placeholder={t("username")}
							defaultValue={userData?.username}
							register={register}
							icon={faUser}
							isRequired={true}
						/>

						<InputBox type="text" name="fname" placeholder={t("fname")} defaultValue={userData?.fname} register={register} icon={faImagePortrait} />

						<InputBox type="text" name="lname" placeholder={t("lname")} defaultValue={userData?.lname} register={register} icon={faIdBadge} />
						<InputBox type="tel" name="tel" placeholder={t("phone")} defaultValue={userData?.tel} register={register} icon={faMobileScreen} />
						<InputBox type="email" name="email" placeholder={t("email")} defaultValue={userData?.email} register={register} icon={faAt} />

						{!userData?.id ? (
							<>
								<InputBox type="password" name="password" placeholder={t("password")} register={register} icon={faUnlock} isRequired={true} />
								<InputBox
									type="password"
									name="password_check"
									placeholder={t("passwordAgain")}
									register={register}
									icon={faLock}
									isRequired={true}
								/>
							</>
						) : (
							<input type="hidden" defaultValue={userData.id} {...register("id")} />
						)}

						<Select name="role_id" options={roles} register={register} defaultValue={userData.role_id} icon={faArrowUpWideShort} />

						<input type="submit" value={userData?.username ? t("submitButton") : t("createButton")} />
					</form>
				</motion.section>
			)}
		</AnimatePresence>
	);
};

export default UserForm;
