import { faCircle } from "@fortawesome/free-regular-svg-icons";
import { faCircleCheck, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { publicPath } from "../../modules/BasicFunctions";

import css from "./css/Images.module.css";

const Image = ({ el, deleteImage, setShowEditCont, multiSelection, selectedImages }) => {
	const [selected, setSelected] = useState(false);
	const [clicked, setClicked] = useState(false);

	useEffect(() => {
		if (!multiSelection) {
			setSelected(false);
		}
	}, [multiSelection]);

	const onClickHandler = (e) => {
		if (multiSelection) {
			let selectedMap = selectedImages.current;
			if (selected) {
				selectedMap.delete(el.name);
			} else {
				selectedMap.set(el.name, el.id);
			}
			setSelected((prev) => !prev);
			return;
		}
		if (e.target.localName === "svg") {
			return;
		}

		setClicked((prev) => !prev);
	};
	return (
		<motion.div
			key={el.id}
			onClick={onClickHandler}
			initial={{ scale: 0.6 }}
			animate={{ scale: 1 }}
			transition={{
				duration: 0.3,
				ease: "easeInOut",
			}}
		>
			<img src={`${publicPath}/images/gallery/${el.name}`} alt={el.title} />
			<AnimatePresence>
				{clicked && (
					<motion.article id={el.id} key={255 + el.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<h3>{el.title}</h3>
						<p>{el.description}</p>
						<FontAwesomeIcon className={css.icon} onClick={deleteImage} icon={faTrashCan} />
						<FontAwesomeIcon className={css.icon} icon={faPenToSquare} onClick={() => setShowEditCont(el)} />
					</motion.article>
				)}
			</AnimatePresence>
			{multiSelection && <FontAwesomeIcon className={css.multiselection} icon={selected ? faCircleCheck : faCircle} />}
		</motion.div>
	);
};

export default Image;
