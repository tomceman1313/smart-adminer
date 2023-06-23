/* eslint-disable jsx-a11y/alt-text */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Category from "../../Components/common/categories-component/Category";
import useAuth from "../../Hooks/useAuth";
import { getProducts, deleteProduct } from "../../modules/ApiProducts";
import useInteraction from "../../Hooks/useInteraction";
import { isPermitted, makeDateFormat, publicPath } from "../../modules/BasicFunctions";

import css from "./Products.module.css";

export default function Products() {
	const auth = useAuth();
	const navigate = useNavigate();
	const { setMessage } = useInteraction();

	const [products, setProducts] = useState();
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Produkty";
		document.getElementById("banner-desc").innerHTML = "Přehled vytvořených produktů, správa kategorií a slev";
		getProducts(setProducts, 0);
	}, []);

	async function deleteHandler(id) {
		await deleteProduct(id, auth, setMessage);
		getProducts(setProducts, 0);
	}

	async function filterByCategory(id) {
		// const filteredEmployees = await allEmployees.current.filter((empl) => empl.departments.find((dep) => dep.department_id === id));
		// setEmployees(filteredEmployees);
	}

	return (
		<div className={css.products}>
			<Category
				auth={auth}
				setState={setProducts}
				filterByCategory={filterByCategory}
				categories={categories}
				setCategories={setCategories}
				apiClass="products"
			/>

			<section className={`${css.products_list} no-section`}>
				{products ? (
					products.map((item) => (
						<div key={item.id} className={css.product}>
							<img src={`${publicPath}/images/products/${item.image}`} />
							<p>{item.name}</p>
							{isPermitted(item.active)}
							<div>
								<button onClick={() => navigate(`/dashboard/product/${item.id}`)}>Detail</button>
								<button className="red_button" onClick={() => deleteHandler(item.id)}>
									Smazat
								</button>
							</div>
						</div>
					))
				) : (
					<p>Zatím nebyly vloženy žádné produkty</p>
				)}
			</section>
		</div>
	);
}
