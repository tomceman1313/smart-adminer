import {
	faArrowUpWideShort,
	faAt,
	faIdBadge,
	faImagePortrait,
	faLock,
	faMobileScreen,
	faUnlock,
	faUser,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import css from "./Profiles.module.css";

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import InputBox from "../../components/basic/InputBox";
import Select from "../../components/basic/select/Select";
import Form from "../../components/basic/form/Form";

const UserForm = ({ userData, roles, close, submitHandler }) => {
	const formMethods = useForm();
	const { t } = useTranslation("profiles");

	async function onSubmit(data) {
		const result = await submitHandler(data, userData.username);
		if (result) {
			close();
			formMethods.reset();
		}
	}

	return (
		<motion.section
			className={css.edit}
			initial={{ x: -600 }}
			animate={{ x: 0 }}
			exit={{ x: -600 }}
			transition={{ type: "spring", duration: 1 }}
		>
			<h2>{userData?.username ? userData.username : t("formHeader")}</h2>
			<FontAwesomeIcon id={css.close} icon={faXmark} onClick={close} />
			<Form onSubmit={onSubmit} formContext={formMethods}>
				<InputBox
					key={userData?.username}
					type="text"
					name="username"
					placeholder={t("username")}
					defaultValue={userData?.username}
					icon={faUser}
					isRequired={true}
				/>

				<InputBox
					type="text"
					name="fname"
					placeholder={t("fname")}
					defaultValue={userData?.fname}
					icon={faImagePortrait}
				/>

				<InputBox
					type="text"
					name="lname"
					placeholder={t("lname")}
					defaultValue={userData?.lname}
					icon={faIdBadge}
				/>
				<InputBox
					type="tel"
					name="tel"
					placeholder={t("phone")}
					defaultValue={userData?.tel}
					icon={faMobileScreen}
				/>
				<InputBox
					type="email"
					name="email"
					placeholder={t("email")}
					defaultValue={userData?.email}
					icon={faAt}
				/>

				{!userData?.id ? (
					<>
						<InputBox
							type="password"
							name="password"
							placeholder={t("password")}
							icon={faUnlock}
							isRequired={true}
						/>
						<InputBox
							type="password"
							name="password_check"
							placeholder={t("passwordAgain")}
							icon={faLock}
							isRequired={true}
						/>
					</>
				) : (
					<input
						type="hidden"
						defaultValue={userData.id}
						{...formMethods.register("id")}
					/>
				)}

				<Select
					name="role_id"
					options={roles}
					defaultValue={userData.role_id}
					icon={faArrowUpWideShort}
					setValue={formMethods.setValue}
				/>

				<input
					type="submit"
					value={userData?.username ? t("submitButton") : t("createButton")}
				/>
			</Form>
		</motion.section>
	);
};

export default UserForm;
