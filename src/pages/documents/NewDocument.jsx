import { faFile, faHashtag, faHeading, faImage, faInfo, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InputBox from "../../components/basic/InputBox";
import useInteraction from "../../hooks/useInteraction";
import { create } from "../../modules/ApiFunctions";
import { convertBase64, makeDate, makeDateFormat } from "../../modules/BasicFunctions";
import DatePicker from "../../components/basic/DatePicker";
import { AnimatePresence } from "framer-motion";
import AddMultipleFiles from "./AddMultipleFiles";
import Select from "../../components/basic/select/Select";
import { useTranslation } from "react-i18next";

const NewDocument = ({ auth, refreshData, categories }) => {
	const { t } = useTranslation("documents");
	const { setMessage } = useInteraction();
	const [addMultiplePictures, setAddMultiplePictures] = useState(null);

	const { register, handleSubmit, reset } = useForm();

	const createNew = async (data) => {
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
		if (data.date) {
			data.date = makeDateFormat(data.date);
		} else {
			const date = new Date();
			data.date = makeDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
		}
		await create("documents", data, setMessage, t("positiveTextDocumentCreated"), auth);
		reset();
		refreshData();
	};

	const showAddMultiplePictures = () => {
		setAddMultiplePictures(true);
	};

	return (
		<>
			<section className="half-section">
				<h2>{t("headerCreateDocument")}</h2>
				<form onSubmit={handleSubmit(createNew)}>
					<InputBox placeholder={t("placeholderDocumentTitle")} register={register} type="text" name="title" icon={faHeading} isRequired={true} />
					<InputBox
						placeholder={t("placeholderDocumentDescription")}
						register={register}
						type="text"
						name="description"
						icon={faInfo}
						isRequired={false}
					/>
					<Select name="category_id" options={categories} register={register} placeholderValue={t("placeholderCategorySelect")} icon={faHashtag} />
					<InputBox placeholder="Soubor" register={register} type="file" name="image" icon={faImage} isRequired={false} accept="image/*" />
					<InputBox placeholder="Soubor" register={register} type="file" name="file" icon={faFile} isRequired={true} accept="*" />
					<DatePicker register={register} name="date" title={t("placeholderDocumentDate")} icon={faCalendarDays} />

					<button>{t("buttonCreate")}</button>
					<button type="button" className="blue_button" onClick={showAddMultiplePictures}>
						{t("buttonCreateMultiple")}
					</button>
				</form>
			</section>

			<AnimatePresence>
				{addMultiplePictures && <AddMultipleFiles auth={auth} close={() => setAddMultiplePictures(false)} refreshFiles={refreshData} />}
			</AnimatePresence>
		</>
	);
};

export default NewDocument;
