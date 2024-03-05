import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAll, getByCategory } from "../../modules/ApiFunctions";
import { Helmet } from "react-helmet-async";
import { isPermitted, makeDateFormat, publicPath } from "../../modules/BasicFunctions";
import PlusButton from "../../Components/basic/PlusButton";
import Category from "../../Components/common/categories-component/Category";
import ItemsController from "../../Components/common/items-controller/ItemsController";
import css from "./Articles.module.css";

const Articles = () => {
	const navigate = useNavigate();

	const [articles, setArticles] = useState(null);
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function loadData() {
		setSelectedCategory(null);
		const data = await getAll("articles");
		setArticles(data);
	}

	const openArticleDetails = (e) => {
		const id = e.currentTarget.id;
		navigate(`/article/${id}`);
	};

	async function filterByCategory(id) {
		const data = await getByCategory("articles", id);
		const category = categories.find((el) => el.id === id);
		setSelectedCategory(category);
		setArticles(data);
	}

	return (
		<>
			<Helmet>
				<title>Články | SmartAdminer</title>
			</Helmet>
			<div className={css.articles}>
				<Category
					categories={categories}
					setCategories={setCategories}
					apiClass="articles"
					filterByCategory={filterByCategory}
					reloadData={loadData}
					fullSize
				/>

				<ItemsController
					apiClass="articles"
					setState={setArticles}
					selectedCategory={selectedCategory}
					resetFilter={loadData}
					settingsConfig={{
						searchInput: "Nadpis článku",
						multiSelection: false,
						allItemsText: "Veškeré články",
					}}
				/>

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
				<PlusButton onClick={() => navigate("/new-article/")} />
			</div>
		</>
	);
};

export default Articles;
