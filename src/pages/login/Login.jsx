import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Message from "../../components/admin/Message";
import InputBox from "../../components/basic/InputBox";
import useAuthApi from "../../hooks/api/useAuthApi";
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
				<section
					initial={{ opacity: 0.5 }}
					animate={{ opacity: 1 }}
					transition={{ type: "spring", duration: 0.8 }}
				>
					<h2>{t("headerLogin")}</h2>
					<form onSubmit={handleSubmit(onSubmit)}>
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
						<input type="submit" value={t("common:buttonLogin")} />
					</form>
				</section>

				<Message />
			</div>
		</>
	);
}
