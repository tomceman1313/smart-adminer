import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { filterProducts } from "../../modules/ApiProducts";

import useProductFilterValues from "../../Hooks/useProductFilterValues";
import css from "./Filter.module.css";
import ManufacturersSelector from "./filters/ManufacturersSelector";
import CategoriesSelector from "./filters/CategoriesSelector";
import ProductNameSearchBar from "./filters/ProductNameSearchBar";

export default function Filter({ setProducts, setVisible, manufacturers, categories }) {
	const { selectedManufacturers, selectedCategories, selectedPriceRange, selectedInStock } = useProductFilterValues();

	async function loadFilteredData() {
		const filterValues = {
			manufacturers: selectedManufacturers.current,
			categories: selectedCategories.current,
			price_range: selectedPriceRange.current,
			in_stock: selectedInStock.current,
		};
		const filterData = await filterProducts(filterValues);
		setProducts(filterData);
	}

	async function resetFilter() {
		selectedManufacturers.current = [];
		selectedCategories.current = [];
		selectedPriceRange.current = [];
		selectedInStock.current = [];

		const filterData = await filterProducts([]);
		setProducts(filterData);
		setVisible();
	}

	return (
		<motion.div className={css.filter} initial={{ x: "110%" }} animate={{ x: 0 }} exit={{ x: "110%" }} transition={{ type: "spring", duration: 1.5 }}>
			<FontAwesomeIcon
				id={css.close}
				icon={faXmark}
				onClick={() => {
					setVisible(false);
				}}
			/>
			<h2>Produktový filtr</h2>

			<div className={css.scrollable}>
				<h3>Hledat číslo objednávky:</h3>
				<div className={`${css.search_bar} ${css.filter_param}`}>
					<ProductNameSearchBar setProducts={setProducts} />
				</div>

				<h3>Výrobce:</h3>
				<div className={`${css.status_selector} ${css.filter_param}`}>
					<ManufacturersSelector loadedManufacturers={manufacturers} />
				</div>

				<h3>Kategorie:</h3>
				<div className={`${css.status_selector} ${css.filter_param}`}>
					<CategoriesSelector loadedCategories={categories} />
				</div>
			</div>

			<div className={css.buttons_section}>
				<button onClick={loadFilteredData}>Filtrovat</button>
				<button onClick={resetFilter}>Reset</button>
			</div>
		</motion.div>
	);
}
