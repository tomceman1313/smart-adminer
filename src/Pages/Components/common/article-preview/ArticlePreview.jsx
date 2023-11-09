import React from "react";
import { makeDateFormat } from "../../../modules/BasicFunctions";
import ImagesUnderContent from "./ImagesUnderContent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { publicPath } from "../../../modules/BasicFunctions";
import { AnimatePresence, motion } from "framer-motion";

import css from "./ArticlePreview.module.css";

/**
 * Responsible for rendering preview of article or similar type of content
 **/

export default function ArticlePreview({ article, close, typeOfPreview }) {
	return (
		<AnimatePresence>
			{article && (
				<motion.div className={css.article_preview} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
					<FontAwesomeIcon icon={faXmark} className={css.close} onClick={() => close()} />
					<div className={css.article_cont}>
						{article && (
							<section className={css.article}>
								<img
									className={css.image}
									src={article.image.includes("base64") ? article.image : `${publicPath}/images/${typeOfPreview}/${article.image}`}
									alt={article.title}
								/>
								<p className={css.date}>{makeDateFormat(article.date, "text")}</p>
								<h2 className={css.title}>{article.title}</h2>
								<p className={css.description}>{article.description}</p>
								<div className={css.body} dangerouslySetInnerHTML={{ __html: article.body }}></div>
								<ImagesUnderContent images={article.images} path={typeOfPreview} />
							</section>
						)}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
