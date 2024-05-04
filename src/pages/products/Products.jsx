/* eslint-disable jsx-a11y/alt-text */
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import PlusButton from "../../components/basic/PlusButton";
import CategoriesController from "../../components/common/categories-controller/CategoriesController";
import NoDataFound from "../../components/loaders/NoDataFound/NoDataFound";
import { ProductsFilterValuesProvider } from "../../context/ProductsFilterValuesContext";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import { useGetAll } from "../../hooks/api/useCRUD";
import useInteraction from "../../hooks/useInteraction";
import { isPermitted, publicPath } from "../../modules/BasicFunctions";
import Filter from "./Filter";
import FilterBasicController from "./FilterBasicController";
import Manufacturers from "./Manufacturers";

import css from "./Products.module.css";

export default function Products() {
	const { t } = useTranslation("products", "errors");
	const navigate = useNavigate();

	const location = useLocation();
	const { remove } = useBasicApiFunctions();
	const { setAlert } = useInteraction();

	const [categories, setCategories] = useState(null);
	const [manufacturers, setManufacturers] = useState(null);
	const [isFilterVisible, setIsFilterVisible] = useState(false);

	const { data: products, refetch } = useGetAll(
		`${location.pathname.slice(1)}${location.search}`,
		null,
		["products", location],
		t("errors:errorFetchProducts")
	);

	function deleteProductHandler(id, name) {
		setAlert({
			id: id,
			question: t("alertDeleteProduct", { name: name }),
			positiveHandler: deleteHandler,
		});
	}

	async function deleteHandler(id) {
		await remove("products", id, t("positiveTextProductDeleted"));
		refetch();
	}

	return (
		<div className={css.products}>
			<Helmet>
				<title>{t("htmlTitleProducts")}</title>
			</Helmet>
			<ProductsFilterValuesProvider>
				<CategoriesController
					categories={categories}
					setCategories={setCategories}
					apiClass="products"
					reloadData={refetch}
				/>
				<Manufacturers
					manufacturers={manufacturers}
					setManufacturers={setManufacturers}
				/>
				<FilterBasicController
					showFilter={() => setIsFilterVisible(true)}
					refetch={refetch}
				/>
				<section className={`${css.products_list} no-section`}>
					{products?.length > 0 ? (
						products.map((item) => (
							<div key={item.id} className={css.product}>
								<img src={`${publicPath}/images/products/${item.image}`} />
								<p>{item.name}</p>
								{isPermitted(item.active)}
								<div>
									<button onClick={() => navigate(`/product/${item.id}`)}>
										{t("buttonDetail")}
									</button>
									<button
										className="red_button"
										onClick={() => deleteProductHandler(item.id, item.name)}
									>
										{t("buttonDelete")}
									</button>
								</div>
							</div>
						))
					) : (
						<NoDataFound text={t("noDataFound")} />
					)}
				</section>
				<AnimatePresence>
					{isFilterVisible && manufacturers && (
						<Filter
							setVisible={setIsFilterVisible}
							manufacturers={manufacturers}
							categories={categories}
						/>
					)}
				</AnimatePresence>
			</ProductsFilterValuesProvider>
			<PlusButton onClick={() => navigate(`/new-product/`)} />
		</div>
	);
}
