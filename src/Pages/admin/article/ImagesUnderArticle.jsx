import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import cssBasic from "../styles/Basic.module.css";
import ImageList from "./ImageList";

export default function ImagesUnderArticle({ register, underArticleImages, setUnderArticleImages, location }) {
	return (
		<div>
			<h2>Obrázky pod článkem:</h2>
			<h3>Přidat obrázky:</h3>
			<div className={`${cssBasic.input_box}`}>
				<input type="file" accept="image/*" {...register("images")} multiple />
				<FontAwesomeIcon className={cssBasic.icon} icon={faImage} />
			</div>

			{underArticleImages && <ImageList images={underArticleImages} setImages={setUnderArticleImages} location={location} />}
		</div>
	);
}
