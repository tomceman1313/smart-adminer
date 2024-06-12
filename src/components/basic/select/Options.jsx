import { useLayoutEffect, useRef, useState } from "react";
import css from "./Select.module.css";
export default function Options({
	name,
	selectRect,
	options,
	setActiveOption,
}) {
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
			y = 55;
		}
	}

	return (
		<ul
			ref={optionsListRef}
			style={{
				width: `${selectRect.width}px`,
				transform: `translateY(${y}px)`,
				animationName: y > 0 ? css.popFromTop : css.popFromBottom,
			}}
		>
			{options &&
				options.map((el) => (
					<li
						key={`${name}-${el.name ? el.name : el}`}
						onClick={() => setActiveOption(el)}
					>
						{el.name ? el.name : el}
					</li>
				))}
		</ul>
	);
}
