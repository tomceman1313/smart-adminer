import React from "react";
import ImageButton from "../../basic/image-button/ImageButton";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import useProductFilterValues from "../../../Hooks/useProductFilterValues";
import { filterProducts } from "../../../modules/ApiProducts";

import css from "./FilterBasicController.module.css";

export default function FilterBasicController({ showFilter, setState }) {
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
			<ImageButton text="Filtrovat" icon={faFilter} className="blue_button" onClick={showFilter} />
			<button className="blue_button" onClick={resetFilter}>
				Resetovat
			</button>
		</div>
	);
}
