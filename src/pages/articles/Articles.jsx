import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import PlusButton from "../../components/basic/PlusButton";
import Category from "../../components/common/categories-component/Category";
import ItemsController from "../../components/common/items-controller/ItemsController";
import ArticleCardLoader from "../../components/loaders/ArticleCardLoader";
import useBasicApiFunctions from "../../hooks/useBasicApiFunctions";
import { isPermitted, makeDateFormat, publicPath } from "../../modules/BasicFunctions";
import css from "./Articles.module.css";
import { useTranslation } from "react-i18next";

const Articles = () => {
	const { t } = useTranslation("articles");
	const navigate = useNavigate();
	const { getAll, getByCategory } = useBasicApiFunctions();

	const [articles, setArticles] = useState(null);
	const { refetch: refetchArticles, isLoading } = useQuery({
		queryKey: ["articles"],
		queryFn: async () => {
			const data = await getAll("articles");
			setSelectedCategory(null);
			setArticles(data);
			return data;
		},
	});

	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	useQuery({
		queryKey: ["categories", selectedCategory],
		queryFn: async () => {
			const data = await getByCategory("articles", selectedCategory?.id);
			setArticles(data);
			return data;
		},
		enabled: false,
	});

	const openArticleDetails = (e) => {
		const id = e.currentTarget.id;
		navigate(`/article/${id}`);
	};

	async function filterByCategory(id) {
		const category = categories.find((el) => el.id === id);
		setSelectedCategory(category);
	}

	return (
		<>
			<Helmet>
				<title>{t("htmlTitleArticles")}</title>
			</Helmet>
			<div className={css.articles}>
				<Category
					categories={categories}
					setCategories={setCategories}
					apiClass="articles"
					filterByCategory={filterByCategory}
					reloadData={refetchArticles}
					fullSize
				/>

				<ItemsController
					apiClass="articles"
					setState={setArticles}
					selectedCategory={selectedCategory}
					resetFilter={refetchArticles}
					settingsConfig={{
						searchInput: t("searchArticleTitle"),
						multiSelection: false,
						allItemsText: t("searchAllArticles"),
					}}
				/>
				{isLoading ? (
					<ArticleCardLoader />
				) : (
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
				)}

				<PlusButton onClick={() => navigate("/new-article/")} />
			</div>
		</>
	);
};

export default Articles;
