import "@splidejs/react-splide/css";
import { useEffect, useState } from "react";
import css from "./Register.module.css";

import { faArrowUpWideShort, faAt, faIdBadge, faImagePortrait, faLock, faMobileScreen, faUnlock, faUser } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import InputBox from "../../Components/basic/InputBox";
import Select from "../../Components/basic/select/Select";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { create, getRoles, checkNameAvailability } from "../../modules/ApiFunctions";

export default function Register() {
	const auth = useAuth();
	const { setMessage } = useInteraction();

	const { register, handleSubmit, reset } = useForm();
	const [privileges, setPrivileges] = useState(null);

	useEffect(() => {
		getRoles(setPrivileges, auth);

		document.getElementById("banner-title").innerHTML = "Registrace a role";
		document.getElementById("banner-desc").innerHTML = "Tvorba nových profilů, přehled a správa práv rolí";
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function onSubmit(data) {
		if (data.password_check !== data.password) {
			setMessage({ action: "alert", text: "Hesla nejsou stejná." });
			return;
		}

		const isAvailable = await checkNameAvailability("admin", data.username);
		if (!isAvailable) {
			setMessage({ action: "alert", text: "Uživatel s tímto uživatelským jménem již existuje" });
			return;
		}

		create("admin", data, setMessage, "Účet vytvořen", auth);
		reset();
	}

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
		</div>
	);
}
