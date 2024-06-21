import {
	faHeading,
	faImage,
	faQuoteRight,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import InputBox from "../../components/basic/InputBox";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import { convertBase64, makeDate } from "../../modules/BasicFunctions";
import AddMultiplePictures from "./AddMultiplePictures";
import { photoSchema } from "../../schemas/zodSchemas";
import CategorySelector from "../../components/basic/category-selector/CategorySelector";
import SubmitButton from "../../components/basic/submit-button/SubmitButton";
import Form from "../../components/basic/form/Form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function NewPicture({ categories }) {
	const { t } = useTranslation("gallery", "validationErrors");
	const formMethods = useForm({ resolver: zodResolver(photoSchema(t)) });
	const { create } = useBasicApiFunctions();
	const [addMultiplePictures, setAddMultiplePictures] = useState(null);

	const [pickedCategories, setPickedCategories] = useState([]);
	const queryClient = useQueryClient();

	const { mutateAsync: createImage, status } = useMutation({
		mutationFn: async (data) => {
			if (data.image[0]) {
				const base64 = await convertBase64(data.image[0]);
				data.image = base64;
			} else {
				data.image = "no-change";
			}
			const date = new Date();
			data.date = makeDate(
				date.getFullYear(),
				date.getMonth() + 1,
				date.getDate()
			);

			data.category_id = pickedCategories;
			return create("gallery", data, t("positiveTextImageCreated"));
		},
		onSuccess: () => {
			formMethods.reset();
			setPickedCategories([]);
			queryClient.invalidateQueries({ queryKey: ["images"] });
		},
	});

	const showAddMultiplePictures = () => {
		setAddMultiplePictures(true);
	};

	return (
		<>
			<section className="half-section">
				<h2>{t("headerCreateImage")}</h2>
				<Form onSubmit={createImage} formContext={formMethods}>
					<InputBox
						placeholder={t("placeholderImageTitle")}
						type="text"
						name="title"
						icon={faHeading}
					/>
					<InputBox
						placeholder={t("placeholderImageDescription")}
						type="text"
						name="description"
						icon={faQuoteRight}
					/>

					<CategorySelector
						categories={categories}
						selectedCategories={pickedCategories}
						setSelectedCategories={setPickedCategories}
						placeholder={t("placeholderCategory")}
					/>

					<InputBox
						type="file"
						name="image"
						icon={faImage}
						isRequired={true}
						accept="image/*"
					/>

					<div style={{ display: "flex" }}>
						<SubmitButton status={status} value={t("buttonCreate")} />
						<button
							type="button"
							className="blue_button"
							onClick={showAddMultiplePictures}
						>
							{t("buttonCreateMultiple")}
						</button>
					</div>
				</Form>
			</section>

			<AnimatePresence>
				{addMultiplePictures && (
					<AddMultiplePictures
						close={() => setAddMultiplePictures(false)}
						categories={categories}
					/>
				)}
			</AnimatePresence>
		</>
	);
}
