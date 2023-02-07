import { useState } from "react";
import { faPenToSquare, faTrashCan, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import css from "./css/Images.module.css";

const Image = ({ el, deleteImage, setShowEditCont, multiSelection, selectedImages }) => {
	const [selected, setSelected] = useState(false);
	const onClickHandler = (e) => {
		if (e.target.localName !== "article") {
			return;
		}

		if (multiSelection) {
			let selectedMap = selectedImages.current;
			if (selected) {
				selectedMap.delete(el.name);
			} else {
				selectedMap.set(el.name, el.id);
			}
			setSelected((prev) => !prev);
		}
	};

	return (
		<div key={el.id} onClick={onClickHandler}>
			<img src={`/images/gallery/${el.name}`} alt={el.title} />
			<article id={el.id}>
				<h3>{el.title}</h3>
				<p>{el.description}</p>
				<FontAwesomeIcon className={css.icon} onClick={deleteImage} icon={faTrashCan} />
				<FontAwesomeIcon className={css.icon} icon={faPenToSquare} onClick={() => setShowEditCont(el)} />
			</article>
			{multiSelection && <FontAwesomeIcon className={css.multiselection} icon={selected ? faCircleCheck : faCircle} />}
		</div>
	);
};

export default Image;
