import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useInteraction from "../../hooks/useInteraction";
import { useForm } from "react-hook-form";
import { edit, getWithAuth } from "../../modules/ApiFunctions";
import { faAt, faIdBadge, faImagePortrait, faMobileScreen, faUser } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import InputBox from "../../components/basic/InputBox";
import NewPassword from "./NewPassword";
import css from "./Profile.module.css";
import { useTranslation } from "react-i18next";

const Profile = () => {
	const { t } = useTranslation("profile");
	const auth = useAuth();
	const { setMessage } = useInteraction();
	const [isEditing, setIsEditing] = useState(false);
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
		if (!isEditing) {
			setFocus("username");
			setIsEditing(!isEditing);
			return;
		}
		setIsEditing(!isEditing);

		edit("users", data, setMessage, t("positiveTextUserUpdated"), auth);
	};

	return (
		<div className={css.profile}>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<section className={css.user_info}>
				<form onSubmit={handleSubmit(onSubmitUserInfo)}>
					<h2>{t("headerUserInfo")}</h2>

					<InputBox
						type="text"
						name="username"
						placeholder={t("placeholderUsername")}
						register={register}
						icon={faUser}
						isRequired
						readOnly={!isEditing}
					/>
					<InputBox
						type="text"
						name="fname"
						placeholder={t("placeholderFirstName")}
						register={register}
						icon={faImagePortrait}
						isRequired
						readOnly={!isEditing}
					/>
					<InputBox
						type="text"
						name="lname"
						placeholder={t("placeholderLastName")}
						register={register}
						icon={faIdBadge}
						isRequired
						readOnly={!isEditing}
					/>
					<InputBox
						type="phone"
						name="tel"
						placeholder={t("placeholderPhone")}
						register={register}
						icon={faMobileScreen}
						isRequired
						readOnly={!isEditing}
					/>
					<InputBox type="email" name="email" placeholder={t("placeholderEmail")} register={register} icon={faAt} isRequired readOnly={!isEditing} />
					<input type="hidden" {...register("id")} />
					<button type="button" onClick={() => setIsNewPasswordVisible(true)}>
						{t("buttonChangePassword")}
					</button>
					<button type="submit" id="submit">
						{isEditing ? t("buttonSave") : t("buttonEdit")}
					</button>
				</form>
			</section>
			<NewPassword isVisible={isNewPasswordVisible} close={() => setIsNewPasswordVisible(false)} setMessage={setMessage} />
		</div>
	);
};

export default Profile;
