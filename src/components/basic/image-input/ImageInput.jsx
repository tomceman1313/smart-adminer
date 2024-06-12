import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faImage,
	faEye,
	faRotate,
	faCrop,
} from "@fortawesome/free-solid-svg-icons";
import { openImage, publicPath } from "../../../modules/BasicFunctions";
import useImageEditor from "../../../hooks/useImageEditor";
import css from "./ImageInput.module.css";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";

export default function ImageInput({
	name,
	path,
	image,
	additionalClasses,
	required = true,
	title,
}) {
	const { t } = useTranslation("imageInputC");
	const {
		register,
		formState: { errors },
	} = useFormContext();

	const { setImage } = useImageEditor();
	const [imageIsSet, setImageIsSet] = useState(image ? true : false);

	let divClassName = `${css.input_box}`;

	if (errors[name]) {
		divClassName += ` ${css.validationError}`;
	}

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
					<span
						onClick={() => openImage(`${publicPath}/images/${path}/${image}`)}
						title={t("titleShowImage")}
					>
						<FontAwesomeIcon icon={faEye} />
					</span>
					<span
						onClick={() => setImage(image, `/images/${path}/${image}`)}
						title={t("titleOpenEditor")}
					>
						<FontAwesomeIcon icon={faCrop} />
					</span>
					<span
						onClick={() => setImageIsSet(false)}
						title={t("titleChangeImage")}
					>
						<FontAwesomeIcon icon={faRotate} />
					</span>
				</div>
			) : (
				<input
					type="file"
					{...register(name)}
					accept="image/*"
					required={required}
				/>
			)}
			<FontAwesomeIcon className={css.icon} icon={faImage} />
			{errors[name] && (
				<p className={css.error_message}>{`* ${errors[name].message}`}</p>
			)}
		</div>
	);
}
