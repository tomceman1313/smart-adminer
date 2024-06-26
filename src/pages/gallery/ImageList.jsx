import { useState } from "react";
import PaginationServerLoading from "../../components/common/pagination/PaginationServerLoading";
import useInteraction from "../../hooks/useInteraction";
import NoDataFound from "../../components/loaders/NoDataFound/NoDataFound";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import EditPicture from "./EditPicture";
import Image from "./Image";
import css from "./css/Images.module.css";

export default function ImageList({
	images,
	totalPages,
	deleteImageHandler,
	selectedImages,
	isMultiSelectionActive,
	editImageHandler,
}) {
	const { t } = useTranslation("gallery");
	const { setAlert } = useInteraction();
	const [showEditCont, setShowEditCont] = useState(null);

	const deleteImage = (e) => {
		setAlert({
			id: e.target.parentNode.id,
			question: t("alertDeleteImage"),
			positiveHandler: deleteImageHandler,
		});
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
						<NoDataFound text={t("headerNoImagesFound")} />
					)}
				</AnimatePresence>
			</section>
			{images?.length > 0 && (
				<PaginationServerLoading path="/gallery/" totalPages={totalPages} />
			)}
			<AnimatePresence>
				{showEditCont && (
					<EditPicture
						image={showEditCont}
						edit={editImageHandler}
						close={() => setShowEditCont(null)}
					/>
				)}
			</AnimatePresence>
		</>
	);
}
