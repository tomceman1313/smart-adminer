import { faUnlock, faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import InputBox from "../../Components/basic/InputBox";
import css from "./NewPassword.module.css";

import { useForm } from "react-hook-form";
import { useState } from "react";
import useUserApi from "../../Hooks/useUserApi";
import useAuth from "../../Hooks/useAuth";

const NewPassword = ({ setState, setAlert }) => {
	const auth = useAuth();
	const changePassword = useUserApi("password");
	const { register, handleSubmit } = useForm();
	const [identical, setIdentical] = useState(false);

	const onSubmit = async (data) => {
		if (data.password !== data.passwordCheck) {
			setIdentical(true);
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
		setState(null);
	};

	return (
		<form id="form" className={css.new_password_cont} onSubmit={handleSubmit(onSubmit)}>
			<InputBox placeholder="Nové heslo" register={register} name="password" icon={faUnlockKeyhole} white={true} />
			<InputBox placeholder="Heslo znovu" register={register} name="passwordCheck" icon={faUnlock} white={true} />
			{identical && <p>Hesla nejsou stejná</p>}
			<div>
				<button type="submit">Změnit</button>
				<button type="button" onClick={hide}>
					Zrušit
				</button>
			</div>
		</form>
	);
};

export default NewPassword;
