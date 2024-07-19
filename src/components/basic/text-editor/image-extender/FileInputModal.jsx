import { faFileImage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";

import css from "./FileInputModal.module.css";

export default function FileInputModal({ addImage, close }) {
	const fileInputRef = useRef(null);

	function handleDragOver(event) {
		event.preventDefault();
		event.stopPropagation();
		event.dataTransfer.dropEffect = "copy";
	}

	function handleDrop(event) {
		event.preventDefault();
		event.stopPropagation();
		const droppedFiles = Array.from(event.dataTransfer.files);
		console.log(droppedFiles);
	}

	function handleFileChange(event) {
		const selectedFiles = Array.from(event.target.files);
		console.log(selectedFiles);
	}

	const handleClick = () => {
		fileInputRef.current.click();
	};

	return (
		<section className={css.modal}>
			<div
				className="drag-drop-zone"
				onDragOver={handleDragOver}
				onDrop={handleDrop}
			>
				<FontAwesomeIcon icon={faFileImage} />
				<p>Přetáhněte obrázek pro nahrání</p>
				<label>Nebo</label>
				<button onClick={handleClick}>Procházet soubory</button>
			</div>
			<input
				type="file"
				multiple
				ref={fileInputRef}
				style={{ display: "none" }}
				onChange={handleFileChange}
			/>
		</section>
	);
}
