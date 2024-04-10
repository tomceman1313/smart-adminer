/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Category from "../../components/common/categories-component/Category";
import useAuth from "../../hooks/useAuth";
import useInteraction from "../../hooks/useInteraction";
import { getAll, remove } from "../../modules/ApiFunctions";
import { isPermitted, publicPath } from "../../modules/BasicFunctions";
import { Helmet } from "react-helmet-async";
import { AnimatePresence } from "framer-motion";
import PlusButton from "../../components/basic/PlusButton";
import FilterBasicController from "./FilterBasicController";
import { ProductsFilterValuesProvider } from "../../context/ProductsFilterValuesContext";
import Filter from "./Filter";
import Manufacturers from "./Manufacturers";
import css from "./Products.module.css";
import { useTranslation } from "react-i18next";

export default function Products() {
	const auth = useAuth();
	const { t } = useTranslation("products");
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
		setProducts(data);
	}

	function deleteProductHandler(id, name) {
		setAlert({ id: id, question: t("alertDeleteProduct", { name: name }), positiveHandler: deleteHandler });
	}

	async function deleteHandler(id) {
		await remove("products", id, setMessage, t("positiveTextProductDeleted"), auth);
		loadData();
	}

	return (
		<div className={css.products}>
			<Helmet>
				<title>{t("htmlTitleProducts")}</title>
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
									<button onClick={() => navigate(`/product/${item.id}`)}>{t("buttonDetail")}</button>
									<button className="red_button" onClick={() => deleteProductHandler(item.id, item.name)}>
										{t("buttonDelete")}
									</button>
								</div>
							</div>
						))
					) : (
						<p>{t("noDataFound")}</p>
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
