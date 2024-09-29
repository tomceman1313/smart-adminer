import { useCurrentEditor } from "@tiptap/react";
import { useState } from "react";
import FileInputModal from "./FileInputModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { convertBase64 } from "../../../../modules/BasicFunctions";
import css from "./ImageExtender.module.css";

export default function AddImageButton({ label, whiteMode }) {
	const { editor } = useCurrentEditor();
	const [isModalVisible, setIsModalVisible] = useState(false);

	async function addImage(image) {
		const base64 = await convertBase64(image[0]);

		if (image[0]) {
			editor
				.chain()
				.focus()
				.setImage({ src: base64, title: image[0].name })
				.run();
		}
	}

	return (
		<>
			<li className={`${css.image_button} ${whiteMode ? css.white : ""}`}>
				<FontAwesomeIcon
					icon={faImage}
					onClick={() => setIsModalVisible(true)}
					className={css.icon}
				/>
				{label && <label>{label}</label>}
			</li>
			{isModalVisible && <FileInputModal addImage={addImage} />}
		</>
	);
}
