import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faEye, faRotate, faCrop } from "@fortawesome/free-solid-svg-icons";
import { openImage, publicPath } from "../../../modules/BasicFunctions";
import useImageEditor from "../../../hooks/useImageEditor";
import css from "./ImageInput.module.css";

export default function ImageInput({ name, register, path, image, additionalClasses, required = true, title }) {
	const { setImage } = useImageEditor();
	const [imageIsSet, setImageIsSet] = useState(image ? true : false);

	let divClassName = `${css.input_box}`;
	if (additionalClasses) {
		if (additionalClasses.includes("half")) {
			divClassName += ` ${css.half}`;
		}
	}

	useEffect(() => {
		image ? setImageIsSet(true) : setImageIsSet(false);
	}, [image]);

	return (
		<div className={divClassName} title={title}>
			{imageIsSet ? (
				<div className={css.image_box}>
					<span onClick={() => openImage(`${publicPath}/images/${path}/${image}`)} title="Zobrazit obrázek">
						<FontAwesomeIcon icon={faEye} />
					</span>
					<span onClick={() => setImage(image, `/images/${path}/${image}`)} title="Otevřít editor obrázku">
						<FontAwesomeIcon icon={faCrop} />
					</span>
					<span onClick={() => setImageIsSet(false)} title="Změnit obrázek">
						<FontAwesomeIcon icon={faRotate} />
					</span>
				</div>
			) : (
				<input type="file" {...register(name)} accept="image/*" required={required} />
			)}
			<FontAwesomeIcon className={css.icon} icon={faImage} />
		</div>
	);
}
