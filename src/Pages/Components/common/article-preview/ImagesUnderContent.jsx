import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import FullScreenImage from "../fullscreen-image/FullScreenImage";
import { publicPath } from "../../../modules/BasicFunctions";

import css from "./ImagesUnderContent.module.css";

export default function ImagesUnderContent({ images, path }) {
	const [showFullScreenImages, setShowFullScreenImages] = useState(false);

	function openImages() {
		setShowFullScreenImages(true);
	}

	return (
		<>
			{images?.length && images.length > 0 && (
				<div className={css.under_images} onClick={openImages}>
					<img src={images.includes("base64") ? images[0] : `${publicPath}/images/articles/${images[0].name}`} alt="" />
					<span>{`Další ${images.length} fotek`}</span>
				</div>
			)}
			<AnimatePresence>
				{showFullScreenImages && <FullScreenImage photos={images} close={() => setShowFullScreenImages(false)} start={0} path={path} />}
			</AnimatePresence>
		</>
	);
}
