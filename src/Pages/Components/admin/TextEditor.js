import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ value, setValue, isLiteVersion }) => {
	let m, f;

	if (isLiteVersion) {
		m = {
			toolbar: [
				[{ header: [1, 2, 3, false] }],
				["bold", "italic", "underline"],
				[{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
				["link", "clean"],
			],
			clipboard: {
				matchVisual: false,
			},
		};

		f = ["header", "bold", "italic", "underline", "list", "bullet", "indent", "link"];
	} else {
		m = {
			toolbar: [
				[{ header: [1, 2, 3, false] }],
				["bold", "italic", "underline"],
				[{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
				["link", "image"],
				["clean"],
			],
			clipboard: {
				matchVisual: false,
			},
		};

		f = ["header", "bold", "italic", "underline", "strike", "list", "bullet", "indent", "link", "image"];
	}

	return (
		<div>
			<ReactQuill theme="snow" modules={m} formats={f} value={value} onChange={setValue}></ReactQuill>
		</div>
	);
};

export default TextEditor;
