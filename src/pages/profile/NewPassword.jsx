import { faUnlock, faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import InputBox from "../../components/basic/InputBox";
import useAuth from "../../hooks/useAuth";
import { changePassword } from "../../modules/ApiAuth";

import css from "./NewPassword.module.css";
import { useTranslation } from "react-i18next";

const NewPassword = ({ isVisible, close, setMessage }) => {
	const { t } = useTranslation("profile");
	const auth = useAuth();
	const { register, handleSubmit, reset } = useForm();

	const onSubmit = async (data) => {
		if (data.password !== data.passwordCheck) {
			setMessage({ action: "alert", text: t("messagePasswordsNotEquals") });
			return;
		}

		data.id = auth.userInfo.id;
		const result = await changePassword(data, auth);

		if (!result) {
			setMessage({ action: "failure", text: t("messagePasswordNotChanged") });
			return;
		}
		setMessage({ action: "success", text: t("positiveTextPasswordChanged") });
		close();
	};

	const hide = () => {
		reset();
		close();
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.form
					className={css.new_password_cont}
					onSubmit={handleSubmit(onSubmit)}
					initial={{ opacity: 0, x: "-50%", y: "-50%", scale: 0.5 }}
					animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
					exit={{ opacity: 0, scale: 0.5 }}
					transition={{
						type: "spring",
						bounce: 0.5,
					}}
				>
					<InputBox
						placeholder={t("placeholderPassword")}
						type="password"
						register={register}
						name="password"
						icon={faUnlockKeyhole}
						white={true}
						isRequired={true}
					/>
					<InputBox
						placeholder={t("placeholderRepeatPassword")}
						type="password"
						register={register}
						name="passwordCheck"
						icon={faUnlock}
						white={true}
						isRequired={true}
					/>
					<div>
						<button type="submit">{t("buttonChange")}</button>
						<button type="button" onClick={hide}>
							{t("buttonCancel")}
						</button>
					</div>
				</motion.form>
			)}
		</AnimatePresence>
	);
};

export default NewPassword;