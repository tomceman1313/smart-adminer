import { faUnlock, faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import InputBox from "../../Components/basic/InputBox";
import css from "./NewPassword.module.css";

import { useForm } from "react-hook-form";
import { useState } from "react";
import useUserApi from "../../Hooks/useUserApi";
import useAuth from "../../Hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const NewPassword = ({ state, setState, setAlert }) => {
	const auth = useAuth();
	const changePassword = useUserApi("password");
	const { register, handleSubmit, reset } = useForm();
	const [identical, setIdentical] = useState(false);

	const onSubmit = async (data) => {
		if (data.password !== data.passwordCheck) {
			setIdentical(true);
			return;
		}

		if (data.password === "") {
			return;
		}
		data.id = auth.userInfo.id;
		const result = await changePassword(data, auth);

		if (!result) {
			setAlert({ action: "failure", text: "Heslo se nepodařilo změnit", timeout: 6000 });
			return;
		}
		setAlert({ action: "success", text: "Heslo bylo úspěšně změněno", timeout: 6000 });
		setState(null);
	};

	const hide = () => {
		setIdentical(false);
		reset();
		setState(null);
	};

	return (
		<AnimatePresence>
			{state && (
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
					<InputBox placeholder="Nové heslo" type="password" register={register} name="password" icon={faUnlockKeyhole} white={true} />
					<InputBox placeholder="Heslo znovu" type="password" register={register} name="passwordCheck" icon={faUnlock} white={true} />
					{identical && <p style={{ color: "white" }}>Zadaná hesla nejsou stejná nebo heslo není vyplněno!</p>}
					<div>
						<button type="submit">Změnit</button>
						<button type="button" onClick={hide}>
							Zrušit
						</button>
					</div>
				</motion.form>
			)}
		</AnimatePresence>
	);
};

export default NewPassword;
