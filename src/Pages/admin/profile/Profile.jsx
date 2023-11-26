import { useEffect, useState } from "react";
import css from "./Profile.module.css";
import useAuth from "../../Hooks/useAuth";
import { edit } from "../../modules/ApiFunctions";
import { getUserData } from "../../modules/ApiAuth";
import { faAt, faIdBadge, faImagePortrait, faMobileScreen, faUser } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import InputBox from "../../Components/basic/InputBox";
import NewPassword from "./NewPassword";
import useInteraction from "../../Hooks/useInteraction";

const Profile = () => {
	const auth = useAuth();
	const { setMessage } = useInteraction();
	const [editInfo, setEditInfo] = useState(false);
	const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
	const { register, handleSubmit, setValue, setFocus } = useForm();

	useEffect(() => {
		getUserInfo();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function getUserInfo() {
		const userData = await getUserData(auth);

		setValue("username", userData.username);
		setValue("fname", userData.fname);
		setValue("lname", userData.lname);
		setValue("tel", userData.tel);
		setValue("email", userData.email);
		setValue("id", userData.id);
	}

	const onSubmitUserInfo = (data) => {
		if (!editInfo) {
			setFocus("username");
			document.getElementById("submit").innerHTML = "Uložit";
			setEditInfo(!editInfo);
			return;
		}

		document.getElementById("submit").innerHTML = "Upravit";
		setEditInfo(!editInfo);

		edit("admin", data, setMessage, "Profil upraven", auth);
	};

	return (
		<div className={css.profile}>
			<section className={css.user_info}>
				<form onSubmit={handleSubmit(onSubmitUserInfo)}>
					<h2>Uživatelské údaje</h2>

					<InputBox
						type="text"
						name="username"
						placeholder="Uživatelské jméno"
						register={register}
						icon={faUser}
						isRequired={true}
						readOnly={!editInfo}
					/>
					<InputBox
						type="text"
						name="fname"
						placeholder="Křestní jméno"
						register={register}
						icon={faImagePortrait}
						isRequired={true}
						readOnly={!editInfo}
					/>
					<InputBox type="text" name="lname" placeholder="Příjmení" register={register} icon={faIdBadge} isRequired={true} readOnly={!editInfo} />
					<InputBox type="phone" name="tel" placeholder="Telefon" register={register} icon={faMobileScreen} isRequired={true} readOnly={!editInfo} />
					<InputBox type="email" name="email" placeholder="Email" register={register} icon={faAt} isRequired={true} readOnly={!editInfo} />
					<input type="hidden" {...register("id")} />
					<button type="button" onClick={() => setIsNewPasswordVisible(true)}>
						Změnit heslo
					</button>
					<button type="submit" id="submit">
						Upravit
					</button>
				</form>
			</section>
			<NewPassword isVisible={isNewPasswordVisible} close={() => setIsNewPasswordVisible(false)} setMessage={setMessage} />
		</div>
	);
};

export default Profile;
