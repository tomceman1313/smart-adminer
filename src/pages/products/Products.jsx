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
import { useDelete, useGetAll } from "../../hooks/api/useCRUD";
import useInteraction from "../../hooks/useInteraction";
import Filter from "./Filter";
import FilterBasicController from "./FilterBasicController";
import Manufacturers from "./Manufacturers";
import Product from "./Product";

import css from "./styles/Products.module.css";

export default function Products() {
	const { t } = useTranslation("products", "errors");
	const navigate = useNavigate();
	const location = useLocation();

	const { setAlert } = useInteraction();

	const [categories, setCategories] = useState(null);
	const [isFilterVisible, setIsFilterVisible] = useState(false);

	const { data: products, refetch } = useGetAll(
		`${location.pathname.slice(1)}${location.search}`,
		null,
		["products", location],
		t("errors:errorFetchProducts")
	);

	const { data: manufacturers } = useGetAll(
		"products/manufacturers",
		null,
		["manufacturers"],
		t("errors:errorFetchManufacturers")
	);

	const { mutateAsync: deleteProduct } = useDelete(
		"products",
		t("positiveTextProductDeleted"),
		t("errors:errorCRUDOperation"),
		["products"]
	);

	function deleteProductHandler(id, name) {
		setAlert({
			id: id,
			question: t("alertDeleteProduct", { name: name }),
			positiveHandler: deleteProduct,
		});
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
				<Manufacturers manufacturers={manufacturers} />
				<FilterBasicController
					showFilter={() => setIsFilterVisible(true)}
					refetch={refetch}
				/>
				<section className={`${css.products_list} no-section`}>
					<AnimatePresence>
						{products?.length > 0 ? (
							products.map((item) => (
								<Product
									key={`product-${item.id}`}
									product={item}
									deleteProduct={deleteProductHandler}
								/>
							))
						) : (
							<NoDataFound text={t("noDataFound")} />
						)}
					</AnimatePresence>
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
