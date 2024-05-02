import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import ImageButton from "../../components/basic/image-button/ImageButton";
import useProductFilterValues from "../../hooks/useProductFilterValues";

import css from "./FilterBasicController.module.css";

export default function FilterBasicController({ showFilter, refetch }) {
	const { t } = useTranslation("products");
	const {
		selectedManufacturers,
		selectedCategories,
		selectedPriceRange,
		selectedInStock,
	} = useProductFilterValues();

	async function resetFilter() {
		selectedManufacturers.current = [];
		selectedCategories.current = [];
		selectedPriceRange.current = [];
		selectedInStock.current = [];
		refetch();
	}

	return (
		<div className={css.filter_controller}>
			<ImageButton
				text={t("buttonFilter")}
				icon={faFilter}
				className="blue_button"
				onClick={showFilter}
			/>
			<button className="blue_button" onClick={resetFilter}>
				{t("buttonReset")}
			</button>
		</div>
	);
}
