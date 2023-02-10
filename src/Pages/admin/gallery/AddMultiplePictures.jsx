import { faHashtag, faXmark, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCategories, multipleCreate } from "../../modules/ApiGallery";
import useInteraction from "../../Hooks/useInteraction";
import { convertBase64, makeDate } from "../../modules/BasicFunctions";

import cssBasic from "../styles/Basic.module.css";
import css from "./css/Gallery.module.css";

const AddMultiplePictures = ({ auth, close, refreshImages }) => {
	const { setMessage } = useInteraction();
	const [category, setCategory] = useState(null);
	const [pickedCategories, setPickedCategories] = useState([]);
	const { register, handleSubmit, reset, setValue } = useForm();

	useEffect(() => {
		getCategories(auth, setCategory);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (data) => {
		let imagesArray = [];
		for (const file of data.images) {
			const base64 = await convertBase64(file);
			imagesArray.push(base64);
		}
		data.images = imagesArray;
		const date = new Date();
		data.date = makeDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
		data.category_id = pickedCategories;

		await multipleCreate(data, auth);
		setMessage({ action: "success", text: "Obrázky byly přidány" });
		reset();
		setPickedCategories([]);
		refreshImages();
		close();
	};

	const chooseCategory = (e) => {
		const name = category.filter((item) => item.id === parseInt(e.target.value));
		const alreadyIn = pickedCategories.find((item) => item.id === parseInt(e.target.value));
		setValue("category_id", "default");
		if (alreadyIn) {
			return;
		}

		if (name.length !== 0) {
			setPickedCategories((prev) => [...prev, name[0]]);
		}
	};

	const removeFromPicked = (e) => {
		const removed = pickedCategories.filter((item) => item.id !== parseInt(e.target.id));
		setPickedCategories(removed);
	};

	return (
		<motion.section className={css.add_images_cont} initial={{ y: "-150%", x: "-50%" }} animate={{ y: 50 }} exit={{ y: "-150%" }} transition={{ type: "spring", duration: 1 }}>
			<FontAwesomeIcon className={css.close_btn} icon={faXmark} onClick={close} />
			<h2>Přidání obrázků</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={`${cssBasic.input_box} ${cssBasic.white_color}`}>
					<select defaultValue={"default"} {...register("category_id")} onChange={chooseCategory} required>
						<option value="default" disabled>
							-- Přiřadit kategorii --
						</option>
						{category &&
							category.map((el) => (
								<option key={el.id} value={el.id}>
									{el.name}
								</option>
							))}
					</select>
					<FontAwesomeIcon className={cssBasic.icon} icon={faHashtag} />
				</div>

				<div className={`${cssBasic.input_box} ${cssBasic.white_color}`}>
					<input type="file" accept="image/*" {...register("images")} multiple />
					<FontAwesomeIcon className={cssBasic.icon} icon={faImage} />
				</div>

				<ul className={css.picked_categories}>
					{pickedCategories &&
						pickedCategories.map((el) => (
							<li key={el.id} id={el.id} onClick={removeFromPicked}>
								{el.name}
							</li>
						))}
				</ul>

				<button>Uložit</button>
			</form>
		</motion.section>
	);
};

export default AddMultiplePictures;
