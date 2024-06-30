import { useState, useEffect } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
	DragOverlay,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	rectSortingStrategy,
	sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

export default function SortableList({
	children,
	overlayElement,
	items,
	setState,
	sortCallbackFunction,
}) {
	const debouncedItems = useDebounce(items, 1500);
	const [active, setActive] = useState(null);
	const [isModifying, setIsModifying] = useState(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	useEffect(() => {
		const debouncedIds = debouncedItems.map((item) => item.id);
		const currentIds = items.map((item) => item.id);

		if (isModifying || isModifying === null) {
			return;
		}

		// check if debounced value is matched to visible order (without this fires callback function immediately)
		if (currentIds.toString() !== debouncedIds.toString()) {
			return;
		}
		sortCallbackFunction(debouncedIds);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedItems, isModifying]);

	function handleDragStart(event) {
		const { active } = event;
		const activeItem = items.find((item) => item.id === active.id);
		setActive(activeItem);
		setIsModifying(true);
	}

	function handleDragEnd(event) {
		const { active, over } = event;
		if (active.id !== over?.id) {
			setState((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);
				return arrayMove(items, oldIndex, newIndex);
			});
		}

		setIsModifying(false);
	}

	function handleDragCancel() {
		setActive(null);
		setIsModifying(false);
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragCancel={handleDragCancel}
		>
			<SortableContext items={items} strategy={rectSortingStrategy}>
				{children}
			</SortableContext>
			<DragOverlay>{active ? overlayElement(active, items) : null}</DragOverlay>
		</DndContext>
	);
}
