import { faHashtag, faHeading, faImage, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InputBox from "../../Components/basic/InputBox";
import useInteraction from "../../Hooks/useInteraction";
import { create, getAll } from "../../modules/ApiFunctions";
import { convertBase64, makeDate } from "../../modules/BasicFunctions";

import { AnimatePresence } from "framer-motion";
import cssBasic from "../styles/Basic.module.css";
import AddMultiplePictures from "./AddMultiplePictures";
import css from "./css/Gallery.module.css";

export default function NewPicture({ auth, setImages, categories }) {
	const { setMessage } = useInteraction();
	const [addMultiplePictures, setAddMultiplePictures] = useState(null);

	const [pickedCategories, setPickedCategories] = useState([]);
	const { register, handleSubmit, reset, setValue } = useForm();

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
		await create("gallery", data, setMessage, "Obrázek vložen", auth);
		reset();
		setPickedCategories([]);
		loadData();
	};

	async function loadData() {
		const data = await getAll("gallery", auth);
		setImages(data);
	}

	const chooseCategory = (e) => {
		const name = categories.filter((item) => item.id === parseInt(e.target.value));
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
			<section className="half-section">
				<h2>Nový obrázek</h2>
				<form onSubmit={handleSubmit(createNew)}>
					<InputBox placeholder="Název obrázku" register={register} type="text" name="title" icon={faHeading} />
					<InputBox placeholder="Popisek" register={register} type="text" name="description" icon={faQuoteRight} />

					<div className={cssBasic.input_box}>
						<select defaultValue={"default"} {...register("category_id")} onChange={chooseCategory} required>
							<option value="default" disabled>
								-- Přiřadit kategorii --
							</option>
							{categories &&
								categories.map((el) => (
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

			<AnimatePresence>
				{addMultiplePictures && <AddMultiplePictures auth={auth} close={() => setAddMultiplePictures(false)} refreshImages={loadData} />}
			</AnimatePresence>
		</>
	);
}
