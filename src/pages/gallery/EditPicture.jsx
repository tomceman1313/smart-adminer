import {
	faHeading,
	faQuoteRight,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InputBox from "../../components/basic/InputBox";
import { getImageCategories } from "../../modules/ApiGallery";
import { photoSchema } from "../../schemas/zodSchemas";
import { useTranslation } from "react-i18next";
import CategorySelector from "../../components/basic/category-selector/CategorySelector";
import css from "./css/Gallery.module.css";
import Form from "../../components/basic/form/Form";

const EditPicture = ({ image, categories, editImage, close }) => {
	const { t } = useTranslation("gallery");
	const [pickedCategories, setPickedCategories] = useState([]);
	const formMethods = useForm();

	useEffect(() => {
		formMethods.setValue("title", image.title);
		formMethods.setValue("description", image.description);
		getImageCategories(image.id, setPickedCategories);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const updateImage = (data) => {
		data.id = image.id;
		data.category_id = pickedCategories;
		editImage(data);
		formMethods.reset();
		setPickedCategories([]);
		close();
	};

	return (
		<motion.section
			className={css.edit_image_cont}
			initial={{ y: "-250%", x: "-50%" }}
			animate={{ y: "-50%" }}
			exit={{ y: "-250%" }}
			transition={{ type: "spring", duration: 1 }}
		>
			<FontAwesomeIcon
				className={css.close_btn}
				icon={faXmark}
				onClick={close}
			/>
			<h2>{t("headerEditImage")}</h2>
			<Form
				onSubmit={updateImage}
				formContext={formMethods}
				validationSchema={photoSchema}
			>
				<InputBox
					placeholder={t("placeholderImageTitle")}
					type="text"
					name="title"
					icon={faHeading}
					white={true}
				/>
				<InputBox
					placeholder={t("placeholderImageDescription")}
					type="text"
					name="description"
					icon={faQuoteRight}
					white={true}
				/>

				<CategorySelector
					categories={categories}
					placeholder={t("placeholderCategory")}
					selectedCategories={pickedCategories}
					setSelectedCategories={setPickedCategories}
					whiteMode
				/>

				<button className="blue_button">{t("buttonSave")}</button>
			</Form>
		</motion.section>
	);
};

export default EditPicture;
