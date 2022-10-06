import React, { useState, useEffect, Component } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const TextEditor = ({ value, setValue }) => {
	let m = {
		toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image"], ["clean"]],
	};

	let f = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"];

	return (
		<div>
			<ReactQuill theme="snow" modules={m} formats={f} value={value} onChange={setValue}></ReactQuill>
			<button>ODESLAT</button>
		</div>
	);
};

export default TextEditor;

// class TextEditor extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			text: "",
// 		};
// 	}

// 	modules = {
// 		toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image"], ["clean"]],
// 	};

// 	formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"];

// 	render() {
// 		return (
// 			<div className="text-editor">
// 				<ReactQuill theme="snow" modules={this.modules} formats={this.formats}></ReactQuill>
// 			</div>
// 		);
// 	}
// }
// export default TextEditor;
