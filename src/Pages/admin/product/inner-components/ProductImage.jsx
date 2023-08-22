import { faCircleChevronLeft, faCircleChevronRight, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { publicPath } from "../../../modules/BasicFunctions";

import { motion } from "framer-motion";
import css from "../styles/Images.module.css";

const ProductImage = ({ el, deleteImage, changeOrder }) => {
	const [clicked, setClicked] = useState(false);

	//moves image to left
	function moveLeft() {
		changeOrder(el, "left");
	}

	//moves image to right
	function moveRight() {
		changeOrder(el, "right");
	}

	function deleteHandler() {
		setClicked((prev) => !prev);
		deleteImage(el);
	}

	//show or hide controls
	function showHide(e) {
		if (e.target.localName === "img") {
			setClicked((prev) => !prev);
		}
	}

	return (
		<motion.div
			className={css.image}
			onClick={showHide}
			initial={{ scale: 0.6 }}
			animate={{ scale: 1 }}
			exit={{ scale: 0.6 }}
			transition={{
				duration: 0.3,
				ease: "easeInOut",
			}}
		>
			<img src={`${publicPath}/images/products/${el.name}`} alt="Obrázek článku" />

			{clicked && (
				<>
					<FontAwesomeIcon className={css.order_arrow} icon={faCircleChevronLeft} onClick={moveLeft} />
					<FontAwesomeIcon className={css.order_arrow} icon={faCircleChevronRight} onClick={moveRight} />
					<motion.article
						id={el.id}
						key={"image-" + el.id}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={deleteHandler}
					>
						<FontAwesomeIcon className={css.icon} icon={faTrashCan} />
					</motion.article>
				</>
			)}
		</motion.div>
	);
};

export default ProductImage;
