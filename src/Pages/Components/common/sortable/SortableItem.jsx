import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
export default function SortableItem({ children, item, className }) {
	const { setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

	const style = {
		opacity: isDragging ? 0.4 : undefined,
		transform: CSS.Translate.toString(transform),
		transition,
	};

	return (
		<li ref={setNodeRef} style={style} className={className}>
			{children}
		</li>
	);
}
