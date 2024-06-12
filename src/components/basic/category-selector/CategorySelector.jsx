import { useState, useRef } from "react";
import { faHashtag, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import Category from "./Category";

import css from "./CategorySelector.module.css";

export default function CategorySelector({
	categories,
	selectedCategories,
	setSelectedCategories,
	placeholder,
	whiteMode,
}) {
	const optionsListRef = useRef(null);
	const selectRef = useRef(null);

	const [isOpened, setIsOpened] = useState(false);

	let y = 0;
	if (selectRef.current) {
		const coordinates = selectRef.current.getBoundingClientRect();
		if (coordinates !== null) {
			y = coordinates.height + 5;
			if (window.screen.height - coordinates.bottom < 160) {
				// It doesn't fit above, so place below.
				y = -155;
			}
		}
	}

	// Add clicked category to the selected list
	function chooseCategory(category) {
		const alreadyIn = selectedCategories.find(
			(item) => item.id === parseInt(category.id)
		);

		if (!alreadyIn) {
			setSelectedCategories((prev) => [...prev, category]);
		}
		setIsOpened(false);
	}

	// show or hide categories list
	function toggleCategoriesList(e) {
		setIsOpened((prev) => !prev);
	}

	// Remove clicked category from selected
	function removeFromPicked(e, category) {
		e.stopPropagation();
		const elementClassList = Array.from(e.currentTarget.classList);
		if (elementClassList.includes("categoryItem")) {
			const removed = selectedCategories.filter(
				(item) => item.id !== category.id
			);
			setSelectedCategories(removed);
		}
	}

	return (
		<>
			<div
				className={
					whiteMode ? `${css.select_cont} ${css.white}` : css.select_cont
				}
			>
				<div
					ref={selectRef}
					className={`${css.select}`}
					onClick={toggleCategoriesList}
				>
					<FontAwesomeIcon className={css.icon} icon={faHashtag} />

					<ul className={css.picked_categories}>
						{selectedCategories.length > 0 ? (
							selectedCategories.map((category) => (
								<Category
									key={`selected-${category.id}`}
									category={category}
									removeFromSelected={removeFromPicked}
								/>
							))
						) : (
							<p>{placeholder}</p>
						)}
					</ul>

					<FontAwesomeIcon icon={faChevronDown} className={css.arrow} />
				</div>

				<AnimatePresence>
					{isOpened && (
						<motion.div
							ref={optionsListRef}
							className={css.categories_list}
							initial={{ y: y - 10 }}
							animate={{ y: y }}
							style={{
								width: `${selectRef.current.getBoundingClientRect().width}px`,
							}}
						>
							<ul>
								{categories &&
									categories.map((el) => (
										<li
											key={`category-${el.name}`}
											onClick={() => chooseCategory(el)}
										>
											{el.name}
										</li>
									))}
							</ul>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	);
}
