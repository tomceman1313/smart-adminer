import React from "react";
import ImageButton from "../../components/basic/image-button/ImageButton";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import useProductFilterValues from "../../hooks/useProductFilterValues";
import { filterProducts } from "../../modules/ApiProducts";

import css from "./FilterBasicController.module.css";
import { useTranslation } from "react-i18next";

export default function FilterBasicController({ showFilter, setState }) {
	const { t } = useTranslation("products");
	const { selectedManufacturers, selectedCategories, selectedPriceRange, selectedInStock } = useProductFilterValues();

	async function resetFilter() {
		selectedManufacturers.current = [];
		selectedCategories.current = [];
		selectedPriceRange.current = [];
		selectedInStock.current = [];

		const filterData = await filterProducts([]);
		setState(filterData);
	}

	return (
		<div className={css.filter_controller}>
			<ImageButton text={t("buttonFilter")} icon={faFilter} className="blue_button" onClick={showFilter} />
			<button className="blue_button" onClick={resetFilter}>
				{t("buttonReset")}
			</button>
		</div>
	);
}
