import SearchInput from "../../basic/search-input/SearchInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilterCircleXmark, faTrashCan, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck as faCircleCheckRegular } from "@fortawesome/free-regular-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import useInteraction from "../../../Hooks/useInteraction";
import css from "./ItemsController.module.css";

export default function ItemsController({
	apiClass,
	setState,
	selectedCategory,
	selectedItems,
	isMultiSelection,
	toggleMultiSelectionActive,
	deleteItems,
	resetFilter,
	settingsConfig,
}) {
	const { setAlert } = useInteraction();

	const multiselectControl = () => {
		if (isMultiSelection) {
			selectedItems.current = new Map();
		}
		toggleMultiSelectionActive();
	};

	function showDeleteItemsModal() {
		let items = selectedItems.current;
		let ids = [];
		items.forEach((value) => {
			ids.push(value);
		});
		setAlert({ id: ids, question: settingsConfig.deleteQuestion, positiveHandler: deleteItems });
	}

	return (
		<section className={css.filter}>
			{settingsConfig && (
				<>
					<h3>
						{selectedCategory != null ? (
							<>
								<span>Kategorie:</span> {selectedCategory.name}
							</>
						) : (
							settingsConfig.allItemsText
						)}
					</h3>

					{settingsConfig.searchInput && (
						<SearchInput
							key={`search-${selectedCategory?.name}`}
							apiClass={apiClass}
							placeholder={settingsConfig.searchInput}
							selectedCategory={selectedCategory}
							setState={setState}
						/>
					)}

					<div className={css.controls}>
						{settingsConfig.multiSelection && (
							<>
								<button title="Výběr více položek" onClick={multiselectControl}>
									{<FontAwesomeIcon icon={isMultiSelection ? faCircleCheck : faCircleCheckRegular} />}
								</button>
								<AnimatePresence>
									{isMultiSelection && (
										<motion.button
											title="Odstranit vybrané"
											className="red_button"
											onClick={showDeleteItemsModal}
											initial={{ scale: 0.5 }}
											animate={{ scale: 1 }}
											exit={{ scale: 0 }}
										>
											<FontAwesomeIcon icon={faTrashCan} />
										</motion.button>
									)}
								</AnimatePresence>
							</>
						)}
						<button title="Zrušit filtr" className="blue_button" onClick={resetFilter}>
							<FontAwesomeIcon icon={faFilterCircleXmark} />
						</button>
					</div>
				</>
			)}
		</section>
	);
}

/**
 *
 * @param {()=>{}} setState - setState for updating items (passing to SearchInput)
 * @param {number[]} selectedItems - items picked when multi-selection is active
 * @param {{id, name}} selectedCategory
 * @param {boolean} isMultiSelection
 * @param {()=>{}} toggleMultiSelectionActive
 * @param {()=>{}} deleteItems
 * @param {()=>{}} resetFilter
 * @param {{deleteQuestion, searchInput, multiSelection, allItemsText}}
 */
