import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import { convertBase64 } from "../../modules/BasicFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import cssBasic from "../../components/styles/Basic.module.css";
import { useTranslation } from "react-i18next";

export default function LoginScreenBackgroundPicker() {
	const { t } = useTranslation("settings");
	const { create } = useBasicApiFunctions();

	async function onChangeHandler(e) {
		const base64 = await convertBase64(e.target.files[0]);
		await create("settings/login_image", { image: base64 }, "Obrázek upraven");
	}

	return (
		<>
			<h3>{t("headerLoginBackground")}</h3>
			<div
				className={`${cssBasic.input_box} ${cssBasic.half}`}
				title="Pozadí přihlašovací stránky"
			>
				<input type="file" accept=".jpg, .jpeg" onChange={onChangeHandler} />
				<FontAwesomeIcon className={cssBasic.icon} icon={faImage} />
			</div>
		</>
	);
}
