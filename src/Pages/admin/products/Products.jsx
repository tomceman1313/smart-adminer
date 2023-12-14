/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Category from "../../Components/common/categories-component/Category";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { getAll } from "../../modules/ApiFunctions";
import { deleteProduct } from "../../modules/ApiProducts";
import { isPermitted, publicPath } from "../../modules/BasicFunctions";
import { Helmet } from "react-helmet";
import { AnimatePresence } from "framer-motion";
import PlusButton from "../../Components/basic/PlusButton";
import FilterBasicController from "../../Components/common/basic-filter-controller/FilterBasicController";
import { ProductsFilterValuesProvider } from "../../context/ProductsFilterValuesContext";
import Filter from "./Filter";
import Manufacturers from "./Manufacturers";
import css from "./Products.module.css";

export default function Products() {
	const auth = useAuth();
	const navigate = useNavigate();
	const { setMessage, setAlert } = useInteraction();

	const [products, setProducts] = useState();
	const [categories, setCategories] = useState(null);
	const [manufacturers, setManufacturers] = useState(null);
	const [isFilterVisible, setIsFilterVisible] = useState(false);

	useEffect(() => {
		loadData();
	}, []);

	async function loadData() {
		const data = await getAll("products");
		console.log(data);
		setProducts(data);
	}

	function deleteProductHandler(id, name) {
		setAlert({ id: id, question: `Opravdu si přejete smazat produkt ${name}?`, positiveHandler: deleteHandler });
	}

	async function deleteHandler(id) {
		await deleteProduct(id, auth, setMessage);
		setMessage({ action: "success", text: "Produkt byl smazán" });
		loadData();
	}

	return (
		<div className={css.products}>
			<Helmet>
				<title>Produkty | SmartAdminer</title>
			</Helmet>
			<ProductsFilterValuesProvider>
				<Category categories={categories} setCategories={setCategories} apiClass="products" reloadData={loadData} />
				<Manufacturers manufacturers={manufacturers} setManufacturers={setManufacturers} />
				<FilterBasicController showFilter={() => setIsFilterVisible(true)} setState={setProducts} />
				<section className={`${css.products_list} no-section`}>
					{products ? (
						products.map((item) => (
							<div key={item.id} className={css.product}>
								<img src={`${publicPath}/images/products/${item.image}`} />
								<p>{item.name}</p>
								{isPermitted(item.active)}
								<div>
									<button onClick={() => navigate(`/product/${item.id}`)}>Detail</button>
									<button className="red_button" onClick={() => deleteProductHandler(item.id, item.name)}>
										Smazat
									</button>
								</div>
							</div>
						))
					) : (
						<p>Zatím nebyly vloženy žádné produkty</p>
					)}
				</section>
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
