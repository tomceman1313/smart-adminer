import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { getAll } from "../../modules/ApiFunctions";
import { isPermitted, makeDateFormat, publicPath } from "../../modules/BasicFunctions";

import css from "./Articles.module.css";

const Articles = () => {
	const auth = useAuth();

	const [articles, setArticles] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Články";
		document.getElementById("banner-desc").innerHTML = "Tvořte a spravujte vlastní články";

		getAll("articles", setArticles, auth);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const openArticleDetails = (e) => {
		const id = e.currentTarget.id;
		navigate(`/dashboard/article/${id}`);
	};

	return (
		<div className={css.articles}>
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
								<label>{makeDateFormat(article.date, "str")}</label>
							</div>

							<div>{isPermitted(article.active)}</div>
						</article>
					))}
			</section>
		</div>
	);
};

export default Articles;
