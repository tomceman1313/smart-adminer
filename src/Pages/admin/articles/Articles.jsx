import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { getAll } from "../../modules/ApiFunctions";
import { getByCategory } from "../../modules/ApiArticles";
import { isPermitted, makeDateFormat, publicPath } from "../../modules/BasicFunctions";

import css from "./Articles.module.css";
import PlusButton from "../../Components/basic/PlusButton";
import Category from "../../Components/common/categories-component/Category";
import FilterNotifier from "../../Components/common/filter-notifier/FilterNotifier";

const Articles = () => {
	const auth = useAuth();
	const navigate = useNavigate();

	const [articles, setArticles] = useState(null);
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Články";
		document.getElementById("banner-desc").innerHTML = "Tvořte a spravujte vlastní články";

		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function loadData() {
		setSelectedCategory(null);
		const data = await getAll("articles", auth);
		setArticles(data);
	}

	const openArticleDetails = (e) => {
		const id = e.currentTarget.id;
		navigate(`/dashboard/article/${id}`);
	};

	function openNewArticle() {
		navigate("/dashboard/new-article");
	}

	async function filterByCategory(id) {
		const data = await getByCategory(id);
		const category = categories.find((el) => el.id === id);
		setSelectedCategory(category.name);
		setArticles(data);
	}

	return (
		<div className={css.articles}>
			<Category categories={categories} setCategories={setCategories} apiClass="articles" filterByCategory={filterByCategory} />
			<FilterNotifier selectedCategory={selectedCategory} resetHandler={loadData} />
			<section className={`${css.articles_list} no-section`}>
				{articles &&
					articles.map((article) => (
						<article key={article.id} id={article.id} onClick={openArticleDetails}>
							<img src={`${publicPath}/images/articles/${article.image}`} alt="" />
							<div>
								<h3>{article.title}</h3>
								<p>{article.description}</p>
							</div>

							<div>
								<label>{makeDateFormat(article.date, "text")}</label>
							</div>

							<div>{isPermitted(article.active)}</div>
						</article>
					))}
			</section>
			<PlusButton onClick={openNewArticle} />
		</div>
	);
};

export default Articles;
