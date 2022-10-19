import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import css from "./Articles.module.css";

const Articles = () => {
	const [articles, setArticles] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Články";
		document.getElementById("banner-desc").innerHTML = "Tvořte a spravujte vlastní články";
		loadData();
	}, []);

	const loadData = () => {
		fetch("http://localhost:4300/api?class=articles&action=getall").then((response) => {
			response.text().then((_data) => {
				const data = JSON.parse(_data);
				setArticles(data);
			});
		});
	};

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
							<img src={`/images/articles/${article.image}`} />
							<div>
								<h3>{article.title}</h3>
								<p>{article.description}</p>
							</div>
						</article>
					))}
			</section>
		</div>
	);
};

export default Articles;
