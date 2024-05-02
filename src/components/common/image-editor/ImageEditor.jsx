import { faFloppyDisk, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { useTranslation } from "react-i18next";
import useBasicApiFunctions from "../../../hooks/api/useBasicApiFunctions";
import useImageEditor from "../../../hooks/useImageEditor";
import { publicPath } from "../../../modules/BasicFunctions";
import css from "./ImageEditor.module.css";

/**
 * * Renders image editor with cropping function
 * @param {id, name} imageInfo
 * @param {string} path
 * @param {boolean} isOpened
 * @param {()=> void} close
 */
export default function ImageEditor() {
	const { t } = useTranslation("gallery");
	const { edit } = useBasicApiFunctions();
	const { image, close } = useImageEditor();

	const cropperRef = useRef(null);

	async function onCrop() {
		if (cropperRef.current) {
			const cropData = {
				...cropperRef.current.getCoordinates(),
				path: image.path,
				id: 111,
			};
			await edit("images", cropData, t("positiveTextImageUpdated"));
			close();
		}
	}

	return (
		<AnimatePresence>
			{image && (
				<motion.div
					className={css.editor}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<FontAwesomeIcon
						icon={faFloppyDisk}
						className={css.save}
						onClick={onCrop}
					/>
					<FontAwesomeIcon
						icon={faXmark}
						className={css.close}
						onClick={close}
					/>
					<Cropper
						src={`${publicPath}${image.path}`}
						ref={cropperRef}
						className={`cropper ${css.cropper}`}
						stencilProps={{
							grid: true,
						}}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
