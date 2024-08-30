import { useRef, useState, useLayoutEffect } from "react";
import css from "./TextSizeSelect.module.css";

export default function Options({ editor, selectRect, setActiveOption }) {
	const optionsListRef = useRef(null);

	const [optionsHeight, setOptionsHeight] = useState(0);

	useLayoutEffect(() => {
		const { height } = optionsListRef.current?.getBoundingClientRect();
		setOptionsHeight(height);
	}, []);

	let y = 0;
	if (selectRect !== null) {
		if (window.innerHeight - selectRect.bottom < 160) {
			// It doesn't fit above, so place below.
			y = -optionsHeight - 5;
		} else {
			y = 30;
		}
	}

	function onClickHandler(optionLabel) {
		setActiveOption(optionLabel);

		switch (optionLabel) {
			case "Nadpis 1":
				editor.chain().focus().toggleHeading({ level: 1 }).run();
				break;
			case "Nadpis 2":
				editor.chain().focus().toggleHeading({ level: 2 }).run();
				break;
			case "Nadpis 3":
				editor.chain().focus().toggleHeading({ level: 3 }).run();
				break;
			case "Text":
				editor.chain().focus().setParagraph().run();
				break;
			default:
				break;
		}
	}

	return (
		<ul
			ref={optionsListRef}
			style={{
				transform: `translateY(${y}px)`,
				animationName: y > 0 ? css.popFromTop : css.popFromBottom,
			}}
		>
			<li onClick={() => onClickHandler("Nadpis 1")}>
				<span>H1</span> Nadpis 1
			</li>

			<li onClick={() => onClickHandler("Nadpis 2")}>
				<span>H2</span> Nadpis 2
			</li>

			<li onClick={() => onClickHandler("Nadpis 3")}>
				<span>H3</span> Nadpis 3
			</li>

			<li onClick={() => onClickHandler("Text")}>
				<span>¶</span>Text
			</li>
		</ul>
	);
}
