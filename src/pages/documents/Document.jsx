import {
	faCircle,
	faFileImage,
	faFileLines,
	faFilePdf,
	faFileVideo,
	faFileWord,
	faFileZipper,
} from "@fortawesome/free-regular-svg-icons";
import {
	faCircleCheck,
	faDownload,
	faPen,
	faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { publicPath } from "../../modules/BasicFunctions";

import css from "./css/Document.module.css";

export default function Document({
	children,
	info,
	deleteDocument,
	multiSelection,
	selectedDocuments,
	editDocument,
}) {
	const [picked, setPicked] = useState(false);
	const [showControls, setShowControls] = useState(false);
	const [icon, setIcon] = useState(faFileLines);
	const fileFormat = info.name.split(".").pop();

	useEffect(() => {
		if (!multiSelection) {
			setPicked(false);
		}
		setIcon(setFileIcon(fileFormat));
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
		window.open(`${publicPath}/files/documents/${info.name}`, "_blank").focus();
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
			className={css.document}
			onClick={onClickHandler}
			initial={{ scale: 0.6 }}
			animate={{ scale: 1 }}
			exit={{ scale: 0.6 }}
		>
			<FontAwesomeIcon
				className={css.file_icon}
				icon={multiSelection ? (picked ? faCircleCheck : faCircle) : icon}
			/>
			<label>{info.title}</label>
			<AnimatePresence>
				{showControls && (
					<motion.div
						id={info.id}
						className={css.controls}
						initial={{ scale: 0.5 }}
						animate={{ scale: 1 }}
						exit={{ scale: 0.8, opacity: 0 }}
						transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
					>
						<FontAwesomeIcon
							className={css.download_icon}
							icon={faDownload}
							onClick={downloadDocument}
						/>
						<FontAwesomeIcon
							className={css.edit_icon}
							icon={faPen}
							onClick={showEditCont}
						/>
						<FontAwesomeIcon
							className={css.delete_icon}
							icon={faTrashCan}
							onClick={deleteDocument}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			{children}
		</motion.div>
	);
}
