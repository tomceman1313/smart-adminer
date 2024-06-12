import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import React from "react";

export default function Category({ category, removeFromSelected }) {
	return (
		<li>
			<span>{category.name}</span>
			<FontAwesomeIcon
				icon={faXmark}
				onClick={(e) => removeFromSelected(e, category)}
				className="categoryItem"
			/>
		</li>
	);
}
