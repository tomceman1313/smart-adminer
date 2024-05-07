import { faHashtag, faImage, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import cssBasic from "../../components/styles/Basic.module.css";
import useItemsControllerApiFunctions from "../../hooks/api/useItemsControllerApiFunctions";
import { convertBase64, makeDate } from "../../modules/BasicFunctions";

import SubmitButton from "../../components/basic/submit-button/SubmitButton";
import css from "./css/Gallery.module.css";

const AddMultiplePictures = ({ close, categories }) => {
	const { t } = useTranslation("gallery");
	const { multipleCreate } = useItemsControllerApiFunctions();
	const [pickedCategories, setPickedCategories] = useState([]);
	const { register, handleSubmit, reset, setValue } = useForm();
	const queryClient = useQueryClient();

	const { mutateAsync: createImages, status } = useMutation({
		mutationFn: async (data) => {
			let imagesArray = [];
			for (const file of data.images) {
				const base64 = await convertBase64(file);
				imagesArray.push(base64);
			}
			data.images = imagesArray;
			const date = new Date();
			data.date = makeDate(
				date.getFullYear(),
				date.getMonth() + 1,
				date.getDate()
			);
			data.category_id = pickedCategories;

			return multipleCreate("gallery", data, t("positiveTextImagesCreated"));
		},
		onSuccess: () => {
			reset();
			setPickedCategories([]);
			close();
			queryClient.invalidateQueries({ queryKey: ["images"] });
		},
	});

	const chooseCategory = (e) => {
		const name = categories.filter(
			(item) => item.id === parseInt(e.target.value)
		);
		const alreadyIn = pickedCategories.find(
			(item) => item.id === parseInt(e.target.value)
		);
		setValue("category_id", "default");
		if (alreadyIn) {
			return;
		}

		if (name.length !== 0) {
			setPickedCategories((prev) => [...prev, name[0]]);
		}
	};

	const removeFromPicked = (e) => {
		const removed = pickedCategories.filter(
			(item) => item.id !== parseInt(e.target.id)
		);
		setPickedCategories(removed);
	};

	return (
		<motion.section
			className={css.add_images_cont}
			initial={{ y: "-300%", x: "-50%" }}
			animate={{ y: "-50%" }}
			exit={{ y: "-300%" }}
			transition={{ type: "spring", duration: 1 }}
		>
			<FontAwesomeIcon
				className={css.close_btn}
				icon={faXmark}
				onClick={close}
			/>
			<h2>{t("headerCreateMultipleImages")}</h2>
			<form onSubmit={handleSubmit(createImages)}>
				<div className={`${cssBasic.input_box} ${cssBasic.white_color}`}>
					<select
						defaultValue={"default"}
						{...register("category_id")}
						onChange={chooseCategory}
						required
					>
						<option value="default" disabled>
							{t("placeholderCategory")}
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

				<div className={`${cssBasic.input_box} ${cssBasic.white_color}`}>
					<input
						type="file"
						accept="image/*"
						{...register("images")}
						multiple
					/>
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

				<SubmitButton
					status={status}
					value={t("buttonCreate")}
					additionalCss={"blue_button"}
				/>
			</form>
		</motion.section>
	);
};

export default AddMultiplePictures;
