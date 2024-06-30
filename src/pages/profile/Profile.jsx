import {
	faAt,
	faIdBadge,
	faImagePortrait,
	faMobileScreen,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import InputBox from "../../components/basic/InputBox";
import Form from "../../components/basic/form/Form";
import { useAuthGet, useUpdate } from "../../hooks/api/useCRUD";
import useAuth from "../../hooks/useAuth";
import { userSchema } from "../../schemas/zodSchemas";
import NewPassword from "./NewPassword";
import css from "./Profile.module.css";

const Profile = () => {
	const { t } = useTranslation("profile", "errors", "validationErrors");
	const auth = useAuth();
	const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
	const formMethods = useForm({ resolver: zodResolver(userSchema(t)) });

	const { data: user } = useAuthGet(
		"users",
		auth.userInfo.id,
		["user"],
		t("errors:errorFetchUser")
	);

	const { mutateAsync: edit } = useUpdate(
		"users",
		t("positiveTextUserUpdated"),
		null,
		["user"]
	);

	async function onSubmitUserInfo(data) {
		await edit(data);
	}

	return (
		<div className={css.profile}>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<section className={css.user_info}>
				{user && (
					<Form onSubmit={onSubmitUserInfo} formContext={formMethods}>
						<h2>{t("headerUserInfo")}</h2>
						<InputBox
							type="text"
							name="username"
							placeholder={t("placeholderUsername")}
							icon={faUser}
							defaultValue={user.username}
						/>
						<InputBox
							type="text"
							name="fname"
							placeholder={t("placeholderFirstName")}
							icon={faImagePortrait}
							defaultValue={user.fname}
						/>
						<InputBox
							type="text"
							name="lname"
							placeholder={t("placeholderLastName")}
							icon={faIdBadge}
							defaultValue={user.lname}
						/>
						<InputBox
							type="phone"
							name="tel"
							placeholder={t("placeholderPhone")}
							icon={faMobileScreen}
							defaultValue={user.phone}
						/>
						<InputBox
							type="email"
							name="email"
							placeholder={t("placeholderEmail")}
							icon={faAt}
							defaultValue={user.email}
						/>
						<input
							type="hidden"
							{...formMethods.register("id")}
							defaultValue={user.id}
						/>
						<button type="submit">{t("buttonSave")}</button>
						<button type="button" onClick={() => setIsNewPasswordVisible(true)}>
							{t("buttonChangePassword")}
						</button>
					</Form>
				)}
			</section>
			<NewPassword
				isVisible={isNewPasswordVisible}
				close={() => setIsNewPasswordVisible(false)}
			/>
		</div>
	);
};

export default Profile;
