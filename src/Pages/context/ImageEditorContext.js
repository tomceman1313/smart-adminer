import { useState, createContext } from "react";

const ImageEditorContext = createContext(null);

export function ImageEditorProvider({ children }) {
	const [image, setImage] = useState(null);

	function setImageFunction(imageName, imagePath) {
		setImage({ name: imageName, path: imagePath });
	}

	return (
		<ImageEditorContext.Provider value={{ image: image, setImage: setImageFunction, close: () => setImage(null) }}>
			{children}
		</ImageEditorContext.Provider>
	);
}

export default ImageEditorContext;
