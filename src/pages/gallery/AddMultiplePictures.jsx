import { faImage, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useItemsControllerApiFunctions from "../../hooks/api/useItemsControllerApiFunctions";
import { convertBase64, makeDate } from "../../modules/BasicFunctions";

import InputBox from "../../components/basic/InputBox";
import CategorySelector from "../../components/basic/category-selector/CategorySelector";
import Form from "../../components/basic/form/Form";
import SubmitButton from "../../components/basic/submit-button/SubmitButton";
import css from "./css/Gallery.module.css";

const AddMultiplePictures = ({ close, categories }) => {
	const { t } = useTranslation("gallery");
	const { multipleCreate } = useItemsControllerApiFunctions();
	const [pickedCategories, setPickedCategories] = useState([]);
	const formMethods = useForm();
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
			formMethods.reset();
			setPickedCategories([]);
			close();
			queryClient.invalidateQueries({ queryKey: ["images"] });
		},
	});

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
			<Form onSubmit={createImages} formContext={formMethods}>
				<CategorySelector
					categories={categories}
					placeholder={t("placeholderCategory")}
					selectedCategories={pickedCategories}
					setSelectedCategories={setPickedCategories}
					whiteMode
				/>

				<InputBox
					type="file"
					accept="image/*"
					multiple
					name="images"
					icon={faImage}
					white
				/>

				<SubmitButton
					status={status}
					value={t("buttonCreate")}
					additionalCss={"blue_button"}
				/>
			</Form>
		</motion.section>
	);
};

export default AddMultiplePictures;
