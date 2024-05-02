import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { filterProducts } from "../../modules/ApiProducts";

import useProductFilterValues from "../../hooks/useProductFilterValues";
import css from "./Filter.module.css";
import ManufacturersSelector from "./filters/ManufacturersSelector";
import CategoriesSelector from "./filters/CategoriesSelector";
import ProductNameSearchBar from "./filters/ProductNameSearchBar";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Filter({
	setProducts,
	setVisible,
	manufacturers,
	categories,
}) {
	const { t } = useTranslation("products");
	const {
		selectedManufacturers,
		selectedCategories,
		selectedPriceRange,
		selectedInStock,
	} = useProductFilterValues();

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	console.log(searchParams.get("categories"));

	async function loadFilteredData() {
		const filterValues = {
			manufacturers: selectedManufacturers.current,
			categories: selectedCategories.current,
			price_range: selectedPriceRange.current,
			in_stock: selectedInStock.current,
		};
		const filterData = await filterProducts(filterValues);
		navigate(
			`/products/?categories=${encodeURIComponent(
				JSON.stringify(selectedCategories.current)
			)}&manufacturers=${encodeURIComponent(
				JSON.stringify(selectedManufacturers.current)
			)}`
		);
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
		<motion.div
			className={css.filter}
			initial={{ x: "110%" }}
			animate={{ x: 0 }}
			exit={{ x: "110%" }}
			transition={{ type: "spring", duration: 1.5 }}
		>
			<FontAwesomeIcon
				id={css.close}
				icon={faXmark}
				onClick={() => {
					setVisible(false);
				}}
			/>
			<h2>{t("headerFilter")}</h2>

			<div className={css.scrollable}>
				<h3>{t("headerSearchByName")}</h3>
				<div className={`${css.search_bar} ${css.filter_param}`}>
					<ProductNameSearchBar setProducts={setProducts} />
				</div>

				{manufacturers?.length > 0 && (
					<>
						<h3>{t("headerManufacturer")}</h3>
						<div className={`${css.status_selector} ${css.filter_param}`}>
							<ManufacturersSelector loadedManufacturers={manufacturers} />
						</div>
					</>
				)}

				{categories?.length > 0 && (
					<>
						<h3>{t("headerCategory")}</h3>
						<div className={`${css.status_selector} ${css.filter_param}`}>
							<CategoriesSelector loadedCategories={categories} />
						</div>
					</>
				)}
			</div>

			<div className={css.buttons_section}>
				<button className="blue_button" onClick={loadFilteredData}>
					{t("buttonFilter")}
				</button>
				<button onClick={resetFilter}>{t("buttonReset")}</button>
			</div>
		</motion.div>
	);
}
