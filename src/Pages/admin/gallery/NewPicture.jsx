import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InputBox from "../../Components/basic/InputBox";
import { getCategories } from "../../modules/ApiGallery";
import { create, getAll } from "../../modules/ApiFunctions";
import { convertBase64, makeDate } from "../../modules/BasicFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faHashtag, faHeading, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import useInteraction from "../../Hooks/useInteraction";

import css from "./css/Gallery.module.css";
import cssBasic from "../styles/Basic.module.css";
import AddMultiplePictures from "./AddMultiplePictures";
import { AnimatePresence } from "framer-motion";

const NewPicture = ({ auth, setImages }) => {
	const { setMessage } = useInteraction();
	const [addMultiplePictures, setAddMultiplePictures] = useState(null);

	const [category, setCategory] = useState(null);
	const [pickedCategories, setPickedCategories] = useState([]);
	const { register, handleSubmit, reset, setValue } = useForm();

	useEffect(() => {
		getCategories(auth, setCategory);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const createNew = async (data) => {
		if (data.image[0]) {
			const base64 = await convertBase64(data.image[0]);
			data.image = base64;
		} else {
			data.image = "no-change";
		}
		const date = new Date();
		data.date = makeDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

		data.category_id = pickedCategories;
		await create("gallery", data, setMessage, "Obrázek vložen", "Obrázek se nepodařilo vložit", auth);
		reset();
		setPickedCategories([]);
		getAll("gallery", setImages, auth);
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

	const showAddMultiplePictures = () => {
		setAddMultiplePictures(true);
	};

	return (
		<>
			<section>
				<h2>Nový obrázek</h2>
				<form onSubmit={handleSubmit(createNew)}>
					<InputBox placeholder="Název obrázku" register={register} type="text" name="title" icon={faHeading} />
					<InputBox placeholder="Popisek" register={register} type="text" name="description" icon={faQuoteRight} />

					<div className={cssBasic.input_box}>
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

					<InputBox placeholder="Obrázek" register={register} type="file" name="image" icon={faImage} isRequired={true} accept="image/*" />

					<ul className={css.picked_categories}>
						{pickedCategories &&
							pickedCategories.map((el) => (
								<li key={el.id} id={el.id} onClick={removeFromPicked}>
									{el.name}
								</li>
							))}
					</ul>

					<button>Vložit</button>
					<button type="button" className="blue_button" onClick={showAddMultiplePictures}>
						Vložit více
					</button>
				</form>
			</section>

			<AnimatePresence>{addMultiplePictures && <AddMultiplePictures auth={auth} close={() => setAddMultiplePictures(false)} refreshImages={() => getAll("gallery", setImages, auth)} />}</AnimatePresence>
		</>
	);
};

export default NewPicture;
