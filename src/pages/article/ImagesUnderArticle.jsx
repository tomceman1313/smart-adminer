import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import cssBasic from "../../components/styles/Basic.module.css";
import ImageList from "./ImageList";
import { useTranslation } from "react-i18next";

export default function ImagesUnderArticle({ register, underArticleImages, setUnderArticleImages, location }) {
	const { t } = useTranslation("articles");

	return (
		<div>
			<h2>{t("headerAdditionalImages")}</h2>
			<h3>{t("headerAddImages")}</h3>
			<div className={`${cssBasic.input_box}`}>
				<input type="file" accept="image/*" {...register("images")} multiple />
				<FontAwesomeIcon className={cssBasic.icon} icon={faImage} />
			</div>

			{underArticleImages && <ImageList images={underArticleImages} setImages={setUnderArticleImages} location={location} />}
		</div>
	);
}
