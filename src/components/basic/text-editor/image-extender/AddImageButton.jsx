import { useCurrentEditor } from "@tiptap/react";
import { useState } from "react";
import FileInputModal from "./FileInputModal";

export default function AddImageButton() {
	const { editor } = useCurrentEditor();
	const [isModalVisible, setIsModalVisible] = useState(false);

	function addImage(image) {
		console.log(image);
		// if (image) {
		// 	editor
		// 		.chain()
		// 		.focus()
		// 		.setImage({ src: image.base64, title: image.name })
		// 		.run();
		// }
	}

	return (
		<>
			<button onClick={() => setIsModalVisible(true)}>Add image</button>
			{isModalVisible && <FileInputModal addImage={addImage} />}
		</>
	);
}
