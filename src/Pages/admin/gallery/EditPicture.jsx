import { faHashtag, faHeading, faQuoteRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputBox from "../../Components/basic/InputBox";
import { getCategories, getImageCategories } from "../../modules/ApiGallery";
import { motion } from "framer-motion";

import cssBasic from "../styles/Basic.module.css";
import css from "./css/Gallery.module.css";

const EditPicture = ({ auth, image, edit, close }) => {
	const [category, setCategory] = useState(null);
	const [pickedCategories, setPickedCategories] = useState([]);
	const { register, handleSubmit, reset, setValue } = useForm();

	useEffect(() => {
		getCategories(auth, setCategory);
		setValue("title", image.title);
		setValue("description", image.description);
		getImageCategories(image.id, setPickedCategories, auth);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const updateImage = (data) => {
		data.id = image.id;
		data.category_id = pickedCategories;
		edit(data);
		reset();
		setPickedCategories([]);
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
		<motion.section className={css.edit_image_cont} initial={{ y: "-150%", x: "-50%" }} animate={{ y: 50 }} exit={{ y: "-150%" }} transition={{ type: "spring", duration: 1 }}>
			<FontAwesomeIcon className={css.close_btn} icon={faXmark} onClick={close} />
			<h2>Úprava informací</h2>
			<form onSubmit={handleSubmit(updateImage)}>
				<InputBox placeholder="Název obrázku" register={register} type="text" name="title" icon={faHeading} white={true} />
				<InputBox placeholder="Popisek" register={register} type="text" name="description" icon={faQuoteRight} white={true} />

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

export default EditPicture;
