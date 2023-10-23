/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Category from "../../Components/common/categories-component/Category";
import FilterNotifier from "../../Components/common/filter-notifier/FilterNotifier";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { getAll, getByCategory } from "../../modules/ApiFunctions";
import { deleteProduct } from "../../modules/ApiProducts";
import { isPermitted, publicPath } from "../../modules/BasicFunctions";

import PlusButton from "../../Components/basic/PlusButton";
import Manufacturers from "./Manufacturers";
import css from "./Products.module.css";
import Filter from "./Filter";
import { AnimatePresence } from "framer-motion";
import { ProductsFilterValuesProvider } from "../../context/ProductsFilterValuesContext";
//TODO Filter & výrobci panel
export default function Products() {
	const auth = useAuth();
	const navigate = useNavigate();
	const { setMessage } = useInteraction();

	const [products, setProducts] = useState();
	const [categories, setCategories] = useState(null);
	const [manufacturers, setManufacturers] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedManufacturer, setSelectedManufacturer] = useState(null);
	const [isFilterVisible, setIsFilterVisible] = useState(true);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Produkty";
		document.getElementById("banner-desc").innerHTML = "Přehled vytvořených produktů, správa kategorií a slev";
		loadData();
	}, []);

	async function loadData() {
		const data = await getAll("products");
		console.log(data);
		setProducts(data);
		setSelectedCategory(null);
	}

	async function deleteHandler(id) {
		await deleteProduct(id, auth, setMessage);
		loadData();
	}

	async function filterByCategory(id) {
		const categoryName = categories.find((category) => category.id === id);
		setSelectedCategory(categoryName.name);
		const filteredData = await getByCategory("products", id);
		setProducts(filteredData);
	}

	async function filterByManufacturer(id) {
		const manufacturer = manufacturers.find((m) => m.id === id);
		setSelectedManufacturer(manufacturer);
	}

	return (
		<div className={css.products}>
			<Category filterByCategory={filterByCategory} categories={categories} setCategories={setCategories} apiClass="products" reloadData={loadData} />
			<Manufacturers manufacturers={manufacturers} setManufacturers={setManufacturers} filterByManufacturer={filterByManufacturer} />
			<FilterNotifier selectedCategory={selectedCategory} resetHandler={loadData} />
			<section className={`${css.products_list} no-section`}>
				{products ? (
					selectedManufacturer ? (
						products.map((item) => (
							<>
								{item.manufacturer_id === selectedManufacturer.id ? (
									<div key={item.id} className={css.product}>
										<img src={`${publicPath}/images/products/${item.image}`} />
										<p>{item.name}</p>
										{isPermitted(item.active)}
										<div>
											<button onClick={() => navigate(`/product/${item.id}`)}>Detail</button>
											<button className="red_button" onClick={() => deleteHandler(item.id)}>
												Smazat
											</button>
										</div>
									</div>
								) : (
									<></>
								)}
							</>
						))
					) : (
						products.map((item) => (
							<div key={item.id} className={css.product}>
								<img src={`${publicPath}/images/products/${item.image}`} />
								<p>{item.name}</p>
								{isPermitted(item.active)}
								<div>
									<button onClick={() => navigate(`/product/${item.id}`)}>Detail</button>
									<button className="red_button" onClick={() => deleteHandler(item.id)}>
										Smazat
									</button>
								</div>
							</div>
						))
					)
				) : (
					<p>Zatím nebyly vloženy žádné produkty</p>
				)}
			</section>

			<ProductsFilterValuesProvider>
				<AnimatePresence>
					{isFilterVisible && manufacturers && (
						<Filter setProducts={setProducts} setVisible={setIsFilterVisible} manufacturers={manufacturers} categories={categories} />
					)}
				</AnimatePresence>
			</ProductsFilterValuesProvider>

			<PlusButton onClick={() => navigate(`/new-product/`)} />
		</div>
	);
}
