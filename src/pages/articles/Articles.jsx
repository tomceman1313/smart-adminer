import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import PlusButton from "../../components/basic/PlusButton";
import CategoriesController from "../../components/common/categories-controller/CategoriesController";
import ItemsController from "../../components/common/items-controller/ItemsController";
import ArticleCardLoader from "../../components/loaders/ArticleCardLoader";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import {
	isPermitted,
	makeDateFormat,
	publicPath,
} from "../../modules/BasicFunctions";
import css from "./Articles.module.css";
import { useTranslation } from "react-i18next";
import useItemsControllerApiFunctions from "../../hooks/api/useItemsControllerApiFunctions";
import NoDataFound from "../../components/loaders/NoDataFound/NoDataFound";

const Articles = () => {
	const { t } = useTranslation("articles", "errors");
	const navigate = useNavigate();
	const { getAll, getByCategory } = useBasicApiFunctions();
	const { searchByName } = useItemsControllerApiFunctions();

	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [searchedName, setSearchedName] = useState("");

	const {
		data: articles,
		refetch: refetchArticles,
		isLoading,
	} = useQuery({
		queryKey: ["articles", selectedCategory, searchedName],
		queryFn: async () => {
			let data;
			if (searchedName !== "") {
				data = await searchByName("articles", searchedName, selectedCategory);
			} else if (selectedCategory) {
				data = await getByCategory("articles", selectedCategory?.id);
			} else {
				data = await getAll("articles");
				setSelectedCategory(null);
			}

			return data;
		},
		meta: {
			errorMessage: t("errors:errorFetchArticles"),
		},
	});

	const openArticleDetails = (e) => {
		const id = e.currentTarget.id;
		navigate(`/articles/${id}`);
	};

	async function filterByCategory(id) {
		const category = categories.find((el) => el.id === id);
		setSelectedCategory(category);
	}

	function resetFilter() {
		refetchArticles();
		setSelectedCategory(null);
		setSearchedName("");
	}

	return (
		<>
			<Helmet>
				<title>{t("htmlTitleArticles")}</title>
			</Helmet>
			<div className={css.articles}>
				<CategoriesController
					apiClass="articles"
					setCategories={setCategories}
					filterByCategory={filterByCategory}
					reloadData={refetchArticles}
					fullSize
				/>

				<ItemsController
					setSearchedName={setSearchedName}
					selectedCategory={selectedCategory}
					resetFilter={resetFilter}
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
						{articles?.length > 0 ? (
							articles.map((article) => (
								<article
									key={article.id}
									id={article.id}
									onClick={openArticleDetails}
								>
									<img
										src={`${publicPath}/images/articles/${article.image}`}
										alt=""
									/>
									<div>
										<h3>{article.title}</h3>
										<p>{article.description}</p>
									</div>

									<div>
										<label>{makeDateFormat(article.date, "text")}</label>
									</div>

									<div>{isPermitted(article.active)}</div>
								</article>
							))
						) : (
							<NoDataFound text={t("noDataFound")} />
						)}
					</section>
				)}

				<PlusButton onClick={() => navigate("/new-article/")} />
			</div>
		</>
	);
};

export default Articles;
