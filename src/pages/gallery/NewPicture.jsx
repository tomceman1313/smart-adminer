import { faHashtag, faHeading, faImage, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InputBox from "../../components/basic/InputBox";
import { convertBase64, makeDate } from "../../modules/BasicFunctions";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import cssBasic from "../../components/styles/Basic.module.css";
import useBasicApiFunctions from "../../hooks/useBasicApiFunctions";
import AddMultiplePictures from "./AddMultiplePictures";

import css from "./css/Gallery.module.css";

export default function NewPicture({ reloadData, categories }) {
	const { t } = useTranslation("gallery");
	const { create } = useBasicApiFunctions();
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
		await create("gallery", data, t("positiveTextImageCreated"));
		reset();
		setPickedCategories([]);
		reloadData();
	};

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
				<h2>{t("headerCreateImage")}</h2>
				<form onSubmit={handleSubmit(createNew)}>
					<InputBox placeholder={t("placeholderImageTitle")} register={register} type="text" name="title" icon={faHeading} />
					<InputBox placeholder={t("placeholderImageDescription")} register={register} type="text" name="description" icon={faQuoteRight} />

					<div className={cssBasic.input_box}>
						<select defaultValue={"default"} {...register("category_id")} onChange={chooseCategory} required>
							<option value="default" disabled>
								{t("placeholderCategorySelect")}
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

					<InputBox register={register} type="file" name="image" icon={faImage} isRequired={true} accept="image/*" />

					<ul className={css.picked_categories}>
						{pickedCategories &&
							pickedCategories.map((el) => (
								<li key={el.id} id={el.id} onClick={removeFromPicked}>
									{el.name}
								</li>
							))}
					</ul>

					<button>{t("buttonCreate")}</button>
					<button type="button" className="blue_button" onClick={showAddMultiplePictures}>
						{t("buttonCreateMultiple")}
					</button>
				</form>
			</section>

			<AnimatePresence>
				{addMultiplePictures && <AddMultiplePictures close={() => setAddMultiplePictures(false)} refreshImages={reloadData} />}
			</AnimatePresence>
		</>
	);
}
