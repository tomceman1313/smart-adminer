import {
	faCalendarDays,
	faHashtag,
	faHeading,
	faInfo,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DatePicker from "../../components/basic/DatePicker";
import InputBox from "../../components/basic/InputBox";
import FileInput from "../../components/basic/file-input/FIleInput";
import ImageInput from "../../components/basic/image-input/ImageInput";
import Select from "../../components/basic/select/Select";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import {
	convertBase64,
	makeDateFormat,
	makeDate,
} from "../../modules/BasicFunctions";
import css from "./css/EditDocument.module.css";
import Form from "../../components/basic/form/Form";
import { documentSchema } from "../../schemas/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditDocument({
	editedDocument,
	refreshData,
	categories,
	setVisible,
}) {
	const { t } = useTranslation("documents", "validationErrors");
	const { edit } = useBasicApiFunctions();
	const formMethods = useForm({ resolver: zodResolver(documentSchema(t)) });

	const onSubmit = async (data) => {
		if (data?.file?.[0]) {
			let fileName = data.file[0].name.split(".");
			const fileExtension = fileName.pop();
			fileName = fileName.join(".");
			const base64 = await convertBase64(data.file[0]);
			data.file = base64;
			data.file_name = fileName;
			data.file_extension = fileExtension;
		}

		if (data?.image?.[0]) {
			const base64 = await convertBase64(data.image[0]);
			data.image = base64;
		} else {
			data.image = "";
		}

		if (data.date) {
			data.date = makeDateFormat(data.date);
		} else {
			const date = new Date();
			data.date = makeDate(
				date.getFullYear(),
				date.getMonth() + 1,
				date.getDate()
			);
		}
		data.id = editedDocument.id;

		await edit("documents", data, t("positiveTextDocumentUpdated"));
		formMethods.reset();
		refreshData();
		setVisible(false);
	};

	return (
		<motion.section
			className={css.edit}
			initial={{ x: -600 }}
			animate={{ x: 0 }}
			exit={{ x: -600 }}
			transition={{ type: "spring", duration: 1 }}
		>
			<h2>{t("headerEditDocument")}</h2>
			<FontAwesomeIcon
				id={css.close}
				icon={faXmark}
				onClick={() => {
					setVisible((prev) => !prev);
				}}
			/>
			<Form onSubmit={onSubmit} formContext={formMethods}>
				<InputBox
					placeholder={t("placeholderDocumentTitle")}
					type="text"
					name="title"
					icon={faHeading}
					defaultValue={editedDocument.title}
				/>
				<InputBox
					placeholder={t("placeholderDocumentDescription")}
					type="text"
					name="description"
					icon={faInfo}
					defaultValue={editedDocument.description}
				/>
				<Select
					name="category_id"
					options={categories}
					placeholderValue={t("placeholderCategorySelect")}
					icon={faHashtag}
					defaultValue={editedDocument.category_id}
				/>
				<ImageInput
					image={editedDocument.image}
					name="image"
					path="documents"
					title="Náhledový obrázek"
					required={false}
				/>
				<FileInput
					fileName={editedDocument.name}
					name="file"
					title="Uložený dokument"
				/>
				<DatePicker
					name="date"
					title={t("placeholderDocumentDate")}
					icon={faCalendarDays}
					defaultValue={makeDateFormat(editedDocument.date, "str")}
				/>
				<button>{t("buttonSave")}</button>
			</Form>
		</motion.section>
	);
}
