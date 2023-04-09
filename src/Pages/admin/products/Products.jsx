import { useState, useEffect } from "react";
import Category from "../../Components/common/categories-component/Category";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";

import css from "./Products.module.css";

export default function Products() {
	const auth = useAuth();

	const [products, setProducts] = useState();
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Produkty";
		document.getElementById("banner-desc").innerHTML = "Přehled vytvořených produktů, správa kategorií a slev";
	}, []);

	return (
		<div className={css.products}>
			<Category
				auth={auth}
				setState={setProducts}
				setSelectedCategory={setSelectedCategory}
				categories={categories}
				setCategories={setCategories}
				apiClass="products"
			/>
		</div>
	);
}
