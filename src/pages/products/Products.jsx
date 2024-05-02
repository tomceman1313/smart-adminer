/* eslint-disable jsx-a11y/alt-text */
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PlusButton from "../../components/basic/PlusButton";
import CategoriesController from "../../components/common/categories-controller/CategoriesController";
import NoDataFound from "../../components/loaders/NoDataFound/NoDataFound";
import { ProductsFilterValuesProvider } from "../../context/ProductsFilterValuesContext";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import useInteraction from "../../hooks/useInteraction";
import { isPermitted, publicPath } from "../../modules/BasicFunctions";
import Filter from "./Filter";
import FilterBasicController from "./FilterBasicController";
import Manufacturers from "./Manufacturers";
import css from "./Products.module.css";

export default function Products() {
	const { t } = useTranslation("products");
	const navigate = useNavigate();
	const { getAll, remove } = useBasicApiFunctions();
	const { setAlert } = useInteraction();

	const [products, setProducts] = useState();
	const [categories, setCategories] = useState(null);
	const [manufacturers, setManufacturers] = useState(null);
	const [isFilterVisible, setIsFilterVisible] = useState(false);

	const { refetch } = useQuery({
		queryKey: ["products"],
		queryFn: async () => {
			const data = await getAll("products");
			setProducts(data);
			return data;
		},
	});

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
					setState={setProducts}
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
							setProducts={setProducts}
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
