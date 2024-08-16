import {
	faCalendarDays,
	faFile,
	faHashtag,
	faHeading,
	faImage,
	faInfo,
} from "@fortawesome/free-solid-svg-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DatePicker from "../../components/basic/DatePicker";
import InputBox from "../../components/basic/InputBox";
import Form from "../../components/basic/form/Form";
import Select from "../../components/basic/select/Select";
import SubmitButton from "../../components/basic/submit-button/SubmitButton";
import { useCreate } from "../../hooks/api/useCRUD";
import {
	convertBase64,
	getTodayDate,
	makeDateFormat,
} from "../../modules/BasicFunctions";
import { documentSchema } from "../../schemas/zodSchemas";
import AddMultipleFiles from "./AddMultipleFiles";

const NewDocument = ({ categories }) => {
	const { t } = useTranslation("documents", "validationErrors");
	const [addMultiplePictures, setAddMultiplePictures] = useState(null);
	const formMethods = useForm({ resolver: zodResolver(documentSchema(t)) });

	const { mutateAsync: createDocument, status } = useCreate(
		"documents",
		t("positiveTextDocumentCreated"),
		null,
		["documents"]
	);

	async function createDocumentHandler(data) {
		let fileName = data.file[0].name.split(".");
		const fileExtension = fileName.pop();
		fileName = fileName.join(".");

		if (data.file[0]) {
			const base64 = await convertBase64(data.file[0]);
			data.file = base64;
			data.file_name = fileName;
			data.file_extension = fileExtension;
		}

		if (data.image[0]) {
			const base64 = await convertBase64(data.image[0]);
			data.image = base64;
		} else {
			delete data.image;
		}

		data.date = makeDateFormat(data.date);

		await createDocument(data);
		formMethods.reset();
	}

	const showAddMultiplePictures = () => {
		setAddMultiplePictures(true);
	};

	return (
		<>
			<section className="half-section">
				<h2>{t("headerCreateDocument")}</h2>
				<Form onSubmit={createDocumentHandler} formContext={formMethods}>
					<InputBox
						placeholder={t("placeholderDocumentTitle")}
						type="text"
						name="title"
						icon={faHeading}
					/>
					<InputBox
						placeholder={t("placeholderDocumentDescription")}
						type="text"
						name="description"
						icon={faInfo}
					/>
					<Select
						name="category_id"
						options={categories}
						placeholderValue={t("placeholderCategorySelect")}
						icon={faHashtag}
					/>
					<InputBox
						placeholder="Soubor"
						type="file"
						name="image"
						icon={faImage}
						accept="image/*"
					/>
					<InputBox
						placeholder="Soubor"
						type="file"
						name="file"
						icon={faFile}
						accept="*"
					/>
					<DatePicker
						name="date"
						title={t("placeholderDocumentDate")}
						icon={faCalendarDays}
						defaultValue={getTodayDate()}
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
					<AddMultipleFiles
						close={() => setAddMultiplePictures(false)}
						categories={categories}
					/>
				)}
			</AnimatePresence>
		</>
	);
};

export default NewDocument;
