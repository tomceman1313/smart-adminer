import { useEffect, useState, useRef } from "react";
import useInteraction from "../../Hooks/useInteraction";
import { edit, getAll, remove } from "../../modules/ApiFunctions";
import { multipleDelete } from "../../modules/ApiGallery";

import css from "./css/Images.module.css";
import EditPicture from "./EditPicture";
import Image from "./Image";
import { AnimatePresence } from "framer-motion";

const Images = ({ images, setImages, auth }) => {
	const { setMessage } = useInteraction();
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
		remove("gallery", e.target.parentNode.id, setMessage, "Obrázek byl smazán", "Obrázek se nepodařilo smazat", auth);
		getAll("gallery", setImages, auth);
	};

	const deleteImages = async () => {
		let images = selectedImages.current;
		let ids = [];
		images.forEach((value) => {
			ids.push(value);
		});
		multipleDelete(ids, auth, setMessage);
		await getAll("gallery", setImages, auth);
	};

	const multiselectControl = () => {
		if (multiSelection) {
			selectedImages.current = new Map();
		}
		setMultiSelection((prev) => !prev);
	};

	return (
		<>
			<section className={css.filter}>
				<h3>Obrázky kategorie "Nezařazeno"</h3>
				<div>
					<button onClick={multiselectControl}>{multiSelection ? "Zrušit výběr" : "Vybrat"}</button>
					{multiSelection && (
						<button className="red_button" onClick={deleteImages}>
							Smazat vybrané
						</button>
					)}
				</div>
			</section>

			<section className={`${css.images} no-section`}>{images && images.map((el) => <Image key={el.id} el={el} deleteImage={deleteImage} setShowEditCont={setShowEditCont} multiSelection={multiSelection} selectedImages={selectedImages} />)}</section>
			<AnimatePresence>{showEditCont && <EditPicture auth={auth} image={showEditCont} edit={editImage} close={() => setShowEditCont(null)} />}</AnimatePresence>
		</>
	);
};

export default Images;
