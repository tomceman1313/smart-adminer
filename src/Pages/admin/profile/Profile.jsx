import { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { useForm } from "react-hook-form";
import { edit, getWithAuth } from "../../modules/ApiFunctions";
import { faAt, faIdBadge, faImagePortrait, faMobileScreen, faUser } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import InputBox from "../../Components/basic/InputBox";
import NewPassword from "./NewPassword";
import css from "./Profile.module.css";

const Profile = () => {
	const auth = useAuth();
	const { setMessage } = useInteraction();
	const [editInfo, setEditInfo] = useState(false);
	const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
	const { register, handleSubmit, setValue, setFocus } = useForm();

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function loadData() {
		const userData = await getWithAuth("users", auth.userInfo.id, auth);
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

		edit("users", data, setMessage, "Profil upraven", auth);
	};

	return (
		<div className={css.profile}>
			<Helmet>
				<title>Správa profilu | SmartAdminer</title>
			</Helmet>
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
