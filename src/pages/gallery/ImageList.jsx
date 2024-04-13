import { useState } from "react";
import PaginationServerLoading from "../../components/common/pagination/PaginationServerLoading";
import useInteraction from "../../hooks/useInteraction";

import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import EditPicture from "./EditPicture";
import Image from "./Image";
import css from "./css/Images.module.css";

export default function ImageList({ images, deleteImageHandler, selectedImages, isMultiSelectionActive, editImageHandler }) {
	const { t } = useTranslation("gallery");
	const { setAlert } = useInteraction();
	const [showEditCont, setShowEditCont] = useState(null);

	const deleteImage = (e) => {
		setAlert({ id: e.target.parentNode.id, question: t("alertDeleteImage"), positiveHandler: deleteImageHandler });
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
						<h2 style={{ fontSize: "1.2rem", textAlign: "center", width: "100%" }}>{t("headerNoImagesFound")}</h2>
					)}
				</AnimatePresence>
			</section>
			{images?.length > 0 && <PaginationServerLoading path="/gallery/" totalPages={2} />}
			<AnimatePresence>
				{showEditCont && <EditPicture image={showEditCont} edit={editImageHandler} close={() => setShowEditCont(null)} />}
			</AnimatePresence>
		</>
	);
}
