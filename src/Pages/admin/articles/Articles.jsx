import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { getAll } from "../../modules/ApiFunctions";
import { isPermitted, makeDateFormat, publicPath } from "../../modules/BasicFunctions";

import css from "./Articles.module.css";
import PlusButton from "../../Components/basic/PlusButton";

const Articles = () => {
	const auth = useAuth();

	const [articles, setArticles] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Články";
		document.getElementById("banner-desc").innerHTML = "Tvořte a spravujte vlastní články";

		const loadData = async () => {
			const data = await getAll("articles", auth);
			setArticles(data);
		};

		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const openArticleDetails = (e) => {
		const id = e.currentTarget.id;
		navigate(`/dashboard/article/${id}`);
	};

	function openNewImages() {
		navigate("/dashboard/new-article");
	}

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
			<PlusButton onClick={openNewImages} />
		</div>
	);
};

export default Articles;
