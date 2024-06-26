import { faCircleCheck as faCircleCheckRegular } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck, faFilterCircleXmark, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import useInteraction from "../../../hooks/useInteraction";
import SearchInput from "../../basic/search-input/SearchInput";
import css from "./ItemsController.module.css";

export default function ItemsController({
	setSearchedName,
	selectedCategory,
	selectedItems,
	isMultiSelection,
	toggleMultiSelectionActive,
	deleteItems,
	resetFilter,
	settingsConfig,
}) {
	const { t } = useTranslation("itemsControllerC");
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
								<span>{t("headerCategory")}:</span> {selectedCategory.name}
							</>
						) : (
							settingsConfig.allItemsText
						)}
					</h3>

					{settingsConfig.searchInput && (
						<SearchInput key={`search-${selectedCategory?.name}`} setSearchedName={setSearchedName} placeholder={settingsConfig.searchInput} />
					)}

					<div className={css.controls}>
						{settingsConfig.multiSelection && (
							<>
								<button title={t("buttonTitleMultipleSelect")} onClick={multiselectControl}>
									{<FontAwesomeIcon icon={isMultiSelection ? faCircleCheck : faCircleCheckRegular} />}
								</button>
								<AnimatePresence>
									{isMultiSelection && (
										<motion.button
											title={t("buttonTitleDeleteSelected")}
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
						<button title={t("buttonTitleResetFilter")} className="blue_button" onClick={resetFilter}>
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
