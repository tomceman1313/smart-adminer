import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileWord, faCircle, faFilePdf, faFileZipper, faFileVideo, faFileImage, faFileLines } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck, faDownload, faTrashCan, faPen } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";

import css from "./css/Documents.module.css";
const Document = ({ info, deleteDocument, multiSelection, selectedDocuments, editDocument }) => {
	const [picked, setPicked] = useState(false);
	const [showControls, setShowControls] = useState(false);
	const [icon, setIcon] = useState(faFileLines);
	const fileFormat = info.name.split(".");
	useEffect(() => {
		if (!multiSelection) {
			setPicked(false);
		}
		setIcon(setFileIcon(fileFormat[1]));
	}, [multiSelection, fileFormat]);

	const onClickHandler = (e) => {
		if (multiSelection) {
			let selectedMap = selectedDocuments.current;
			if (picked) {
				selectedMap.delete(info.name);
			} else {
				selectedMap.set(info.name, info.id);
			}
			setPicked((prev) => !prev);
			return;
		} else {
			setShowControls((prev) => !prev);
		}

		if (e.target.localName !== "div") {
		}
	};

	const downloadDocument = () => {
		window.open(`/admin/files/documents/${info.name}`, "_blank").focus();
	};

	const setFileIcon = (format) => {
		switch (format) {
			case "pdf":
				return faFilePdf;
			case "docx":
				return faFileWord;
			case "zip":
				return faFileZipper;
			case "jpg":
				return faFileImage;
			case "jpeg":
				return faFileImage;
			case "png":
				return faFileImage;
			case "mp4":
				return faFileVideo;
			case "avi":
				return faFileVideo;
			default:
				return faFileLines;
		}
	};

	function showEditCont() {
		editDocument(info);
	}

	return (
		<motion.div
			key={info.id}
			onClick={onClickHandler}
			initial={{ scale: 0.6 }}
			animate={{ scale: 1 }}
			exit={{ scale: 0.6 }}
			transition={{
				duration: 0.3,
				ease: "easeInOut",
			}}
		>
			<FontAwesomeIcon className={css.file_icon} icon={multiSelection ? (picked ? faCircleCheck : faCircle) : icon} />
			<label>{info.name}</label>
			<AnimatePresence>
				{showControls && (
					<motion.div
						id={info.id}
						className={css.controls}
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "150%" }}
						transition={{ duration: 0.8 }}
					>
						<FontAwesomeIcon className={css.download_icon} icon={faDownload} onClick={downloadDocument} />
						<FontAwesomeIcon className={css.edit_icon} icon={faPen} onClick={showEditCont} />
						<FontAwesomeIcon className={css.delete_icon} icon={faTrashCan} onClick={deleteDocument} />
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default Document;
