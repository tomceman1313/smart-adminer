import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const TextEditor = ({ value, setValue }) => {
	let m = {
		toolbar: [[{ header: [1, 2, 3] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image"], ["clean"]],
	};

	let f = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"];

	return (
		<div>
			<ReactQuill theme="snow" modules={m} formats={f} value={value} onChange={setValue}></ReactQuill>
		</div>
	);
};

export default TextEditor;