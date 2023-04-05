import { useEffect, useState, useRef } from "react";
import useInteraction from "../../Hooks/useInteraction";
import { edit, getAll, remove } from "../../modules/ApiFunctions";
import { multipleDelete } from "../../modules/ApiGallery";

import css from "./css/Images.module.css";
import EditPicture from "./EditPicture";
import Image from "./Image";
import { AnimatePresence } from "framer-motion";

const Images = ({ images, setImages, auth, selectedCategory, setSelectedCategory }) => {
	const { setMessage, setAlert } = useInteraction();
	const [showEditCont, setShowEditCont] = useState(null);
	const [multiSelection, setMultiSelection] = useState(false);
	const selectedImages = useRef(new Map());

	useEffect(() => {
		getAll("gallery", setImages, auth);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const editImage = (data) => {
		edit("gallery", data, setMessage, "Obrázek byl upraven", "Obrázek se nepodařilo upravit", auth);
		getAll("gallery", setImages, auth);
	};

	const deleteImage = (e) => {
		setAlert({ id: e.target.parentNode.id, question: "Smazat obrázek?", positiveHandler: deleteImageHandler });
	};

	const deleteImageHandler = (id) => {
		remove("gallery", id, setMessage, "Obrázek byl smazán", "Obrázek se nepodařilo smazat", auth);
		getAll("gallery", setImages, auth);
	};

	const deleteImages = () => {
		let images = selectedImages.current;
		let ids = [];
		images.forEach((value) => {
			ids.push(value);
		});
		setAlert({ id: ids, question: "Smazat obrázky?", positiveHandler: deleteImagesHandler });
	};

	const deleteImagesHandler = async (ids) => {
		multipleDelete(ids, auth, setMessage);
		await getAll("gallery", setImages, auth);
	};

	const multiselectControl = () => {
		if (multiSelection) {
			selectedImages.current = new Map();
		}
		setMultiSelection((prev) => !prev);
	};

	const resetFilter = () => {
		setSelectedCategory(null);
		getAll("gallery", setImages, auth);
	};

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
				<AnimatePresence>{images && images.map((el) => <Image key={el.id} el={el} deleteImage={deleteImage} setShowEditCont={setShowEditCont} multiSelection={multiSelection} selectedImages={selectedImages} />)}</AnimatePresence>
			</section>
			<AnimatePresence>{showEditCont && <EditPicture auth={auth} image={showEditCont} edit={editImage} close={() => setShowEditCont(null)} />}</AnimatePresence>
		</>
	);
};

export default Images;