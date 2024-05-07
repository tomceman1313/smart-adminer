import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Message from "../../components/admin/Message";
import InputBox from "../../components/basic/InputBox";
import useAuthApi from "../../hooks/api/useAuthApi";
import { publicPath } from "../../modules/BasicFunctions";
import LanguageSelector from "../settings/LanguageSelector";
import css from "./Login.module.css";

export default function Login() {
	const { t } = useTranslation(["login", "common"]);
	const { register, handleSubmit } = useForm();
	const { signIn } = useAuthApi();

	function onSubmit(data) {
		signIn(data);
	}

	return (
		<>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<div className={css.login}>
				<img
					className={css.background}
					src={`${publicPath}/login_background.jpeg`}
					alt="background"
				/>
				<section>
					<form onSubmit={handleSubmit(onSubmit)}>
						<h2>{t("headerLogin")}</h2>
						<InputBox
							type="text"
							name="username"
							register={register}
							placeholder={t("placeholderUsername")}
							icon={faUser}
							isRequired
						/>
						<InputBox
							type="password"
							name="password"
							register={register}
							placeholder={t("placeholderPassword")}
							icon={faLock}
							isRequired
						/>
						<button className="blue_button">{t("common:buttonLogin")}</button>
					</form>
				</section>
				<div className={css.logo}>
					<img src={`${publicPath}/favicon.svg`} alt="SmartAdminer icon" />
					<img src={`${publicPath}/logo.png`} alt="SmartAdminer icon" />
				</div>

				<div className={css.languages}>
					<LanguageSelector showHeader={false} />
				</div>

				<Message />
			</div>
		</>
	);
}
