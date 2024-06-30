import { faUnlock, faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import InputBox from "../../components/basic/InputBox";
import useAuthApi from "../../hooks/api/useAuthApi";

import { useTranslation } from "react-i18next";
import Form from "../../components/basic/form/Form";
import { newPasswordSchema } from "../../schemas/zodSchemas";
import css from "./NewPassword.module.css";

const NewPassword = ({ isVisible, close }) => {
	const { t } = useTranslation("profile");
	const { changePassword } = useAuthApi();

	const onSubmit = async (data) => {
		await changePassword(data);
		close();
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					className={css.new_password_cont}
					initial={{ opacity: 0, x: "-50%", y: "-50%", scale: 0.5 }}
					animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
					exit={{ opacity: 0, scale: 0.5 }}
					transition={{
						type: "spring",
						bounce: 0.5,
					}}
				>
					<Form onSubmit={onSubmit} validationSchema={newPasswordSchema(t)}>
						<InputBox
							placeholder={t("placeholderPassword")}
							type="password"
							name="password"
							icon={faUnlockKeyhole}
							white={true}
						/>
						<InputBox
							placeholder={t("placeholderRepeatPassword")}
							type="password"
							name="passwordCheck"
							icon={faUnlock}
							white={true}
						/>
						<div>
							<button type="submit">{t("buttonChange")}</button>
							<button type="button" onClick={close}>
								{t("buttonCancel")}
							</button>
						</div>
					</Form>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default NewPassword;
