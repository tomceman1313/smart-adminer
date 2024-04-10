import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { publicPath } from "../../modules/BasicFunctions";

import css from "./Article.module.css";

const ArticleImage = ({ el, deleteImage, location }) => {
	const [clicked, setClicked] = useState(false);

	const onClickHandler = (e) => {
		setClicked((prev) => !prev);
		if (e.target.localName !== "img") {
			deleteImage(el);
		}
	};

	return (
		<div
			className={css.image}
			onClick={onClickHandler}
			initial={{ scale: 0.6 }}
			animate={{ scale: 1 }}
			exit={{ scale: 0.6 }}
			transition={{
				duration: 0.3,
				ease: "easeInOut",
			}}
		>
			<img src={`${publicPath}/images/${location}/${el.name}`} alt="Obrázek článku" />
			{clicked && (
				<article id={el.id} key={255 + el.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
					<FontAwesomeIcon className={css.icon} icon={faTrashCan} />
				</article>
			)}
		</div>
	);
};

export default ArticleImage;
