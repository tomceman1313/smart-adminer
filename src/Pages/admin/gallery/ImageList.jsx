import { useState } from "react";
import Pagination from "../../Components/common/pagination/Pagination";
import useInteraction from "../../Hooks/useInteraction";

import { AnimatePresence } from "framer-motion";
import EditPicture from "./EditPicture";
import Image from "./Image";
import css from "./css/Images.module.css";

export default function ImageList({ images, allLoadedImages, deleteImageHandler, selectedImages, isMultiSelectionActive, editImageHandler }) {
	const { setAlert } = useInteraction();
	const [showEditCont, setShowEditCont] = useState(null);

	const deleteImage = (e) => {
		setAlert({ id: e.target.parentNode.id, question: "Smazat obrázek?", positiveHandler: deleteImageHandler });
	};

	return (
		<>
			<section className={`${css.images} no-section`}>
				<AnimatePresence>
					{images?.length > 0 ? (
						images.map((el) => (
							<Image
								key={el.id}
								el={el}
								deleteImage={deleteImage}
								setShowEditCont={setShowEditCont}
								multiSelection={isMultiSelectionActive}
								selectedImages={selectedImages}
							/>
						))
					) : (
						<h2 style={{ fontSize: "1.2rem", textAlign: "center", width: "100%" }}>V této kategorii nejsou přidány žádné obrázky.</h2>
					)}
				</AnimatePresence>
			</section>
			{images?.length > 0 && <Pagination dataLength={allLoadedImages.current.length} numberOfItemsInPage={12} path={"/gallery"} />}
			<AnimatePresence>
				{showEditCont && <EditPicture image={showEditCont} edit={editImageHandler} close={() => setShowEditCont(null)} />}
			</AnimatePresence>
		</>
	);
}
