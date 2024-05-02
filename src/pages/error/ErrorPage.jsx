import { useTranslation } from "react-i18next";
import css from "./ErrorPage.module.css";
import { Link } from "react-router-dom";

export default function ErrorPage({ errorCode }) {
	const { t } = useTranslation("errors");
	const background = errorCode === 404 ? css.error404 : css.error503;

	return (
		<div className={`${css.error} ${background}`}>
			<div>
				<h1>{t(`title${errorCode}`)}</h1>
				<h2>{t(`message${errorCode}`)}</h2>
				<h3>{`${t("errorCode")} ${errorCode}`}</h3>
				<Link
					className={`button ${
						errorCode === 404 ? "green_button" : "red_button"
					}`}
					to="/"
				>
					{errorCode === 404 ? t("buttonRedirect404") : t("buttonRedirect503")}
				</Link>
			</div>
		</div>
	);
}
