import { useEffect, useRef, useState } from "react";
import useInteraction from "../../Hooks/useInteraction";
import { edit, remove } from "../../modules/ApiFunctions";
import { multipleDelete } from "../../modules/ApiGallery";
import Pagination from "../../Components/common/pagination/Pagination";

import { AnimatePresence } from "framer-motion";
import EditPicture from "./EditPicture";
import Image from "./Image";
import css from "./css/Images.module.css";

const Images = ({ images, allLoadedImages, loadData, auth, selectedCategory, setSelectedCategory }) => {
	const { setMessage, setAlert } = useInteraction();
	const [showEditCont, setShowEditCont] = useState(null);
	const [multiSelection, setMultiSelection] = useState(false);
	const selectedImages = useRef(new Map());

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function editImage(data) {
		await edit("gallery", data, setMessage, "Obrázek byl upraven", auth);
		loadData();
	}

	const deleteImage = (e) => {
		setAlert({ id: e.target.parentNode.id, question: "Smazat obrázek?", positiveHandler: deleteImageHandler });
	};

	async function deleteImageHandler(id) {
		await remove("gallery", id, setMessage, "Obrázek byl smazán", auth);
		loadData();
	}

	function deleteImages() {
		let images = selectedImages.current;
		let ids = [];
		images.forEach((value) => {
			ids.push(value);
		});
		setAlert({ id: ids, question: "Smazat obrázky?", positiveHandler: deleteImagesHandler });
	}

	async function deleteImagesHandler(ids) {
		await multipleDelete(ids, auth, setMessage);
		loadData();
		setMultiSelection(false);
	}

	function multiselectControl() {
		if (multiSelection) {
			selectedImages.current = new Map();
		}
		setMultiSelection((prev) => !prev);
	}

	function resetFilter() {
		setSelectedCategory(null);
		loadData();
	}

	return (
		<>
			<section className={css.filter}>
				<h3>{selectedCategory != null ? "Obrázky kategorie: " + selectedCategory : "Všechny obrázky"}</h3>
				<div>
					{multiSelection && (
						<button className="red_button" onClick={deleteImages}>
							Smazat vybrané
						</button>
					)}
					<button onClick={multiselectControl}>{multiSelection ? "Zrušit výběr" : "Vybrat"}</button>
					<button onClick={resetFilter}>Odstanit filtr</button>
				</div>
			</section>

			<section className={`${css.images} no-section`}>
				<AnimatePresence>
					{images &&
						images.map((el) => (
							<Image
								key={el.id}
								el={el}
								deleteImage={deleteImage}
								setShowEditCont={setShowEditCont}
								multiSelection={multiSelection}
								selectedImages={selectedImages}
							/>
						))}
				</AnimatePresence>
			</section>
			{images && <Pagination dataLength={allLoadedImages.current.length} numberOfItemsInPage={12} path={"/gallery"} />}
			<AnimatePresence>{showEditCont && <EditPicture image={showEditCont} edit={editImage} close={() => setShowEditCont(null)} />}</AnimatePresence>
		</>
	);
};

export default Images;
