import { useState, useEffect } from "react";
import css from "./ImageInput.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { openImage, publicPath } from "../../../modules/BasicFunctions";

export default function ImageInput({ name, register, path, image }) {
	const [imageIsSet, setImageIsSet] = useState(image ? true : false);

	useEffect(() => {
		image ? setImageIsSet(true) : setImageIsSet(false);
	}, [image]);

	return (
		<div className={css.input_box}>
			{imageIsSet ? (
				<div className={css.image_box}>
					<button type="button" onClick={() => openImage(`${publicPath}/images/${path}/${image}`)}>
						Zobrazit obrázek
					</button>
					<button type="button" onClick={() => setImageIsSet(false)}>
						Změnit obrázek
					</button>
				</div>
			) : (
				<input type="file" {...register(name)} accept="image/*" required />
			)}

			<FontAwesomeIcon className={css.icon} icon={faImage} />
		</div>
	);
}
