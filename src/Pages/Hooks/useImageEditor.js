import { useContext } from "react";
import ImageEditorContext from "../context/ImageEditorContext";

export default function useImageEditor() {
	return useContext(ImageEditorContext);
}
