import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Message from "../../components/admin/Message";
import InputBox from "../../components/basic/InputBox";
import Form from "../../components/basic/form/Form";
import useAuthApi from "../../hooks/api/useAuthApi";
import LanguageSelector from "../settings/LanguageSelector";
import css from "./Login.module.css";

export default function Login() {
	const { t } = useTranslation(["login", "common"]);
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
					src={`login_background.jpeg`}
					alt="background"
				/>
				<section>
					<Form onSubmit={onSubmit}>
						<h2>{t("headerLogin")}</h2>
						<InputBox
							type="text"
							name="username"
							placeholder={t("placeholderUsername")}
							icon={faUser}
							isRequired
						/>
						<InputBox
							type="password"
							name="password"
							placeholder={t("placeholderPassword")}
							icon={faLock}
							isRequired
						/>
						<button className="blue_button">{t("common:buttonLogin")}</button>
					</Form>
				</section>
				<div className={css.logo}>
					<img src={`favicon.svg`} alt="SmartAdminer icon" />
					<img src={`logo.png`} alt="SmartAdminer icon" />
				</div>

				<div className={css.languages}>
					<LanguageSelector showHeader={false} />
				</div>

				<Message />
			</div>
		</>
	);
}
