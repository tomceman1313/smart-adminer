import { faCalendarDays, faHashtag, faHeading, faInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DatePicker from "../../components/basic/DatePicker";
import InputBox from "../../components/basic/InputBox";
import FileInput from "../../components/basic/file-input/FIleInput";
import ImageInput from "../../components/basic/image-input/ImageInput";
import Select from "../../components/basic/select/Select";
import useBasicApiFunctions from "../../hooks/useBasicApiFunctions";
import { convertBase64, makeDateFormat } from "../../modules/BasicFunctions";
import css from "./css/EditDocument.module.css";

export default function EditDocument({ editedDocument, refreshData, categories, setVisible }) {
	const { t } = useTranslation("documents");
	const { edit } = useBasicApiFunctions();
	const { register, handleSubmit, reset } = useForm();

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

		data.date = makeDateFormat(data.date);
		data.id = editedDocument.id;

		await edit("documents", data, t("positiveTextDocumentUpdated"));
		reset();
		refreshData();
		setVisible(false);
	};

	return (
		<motion.section className={css.edit} initial={{ x: -600 }} animate={{ x: 0 }} exit={{ x: -600 }} transition={{ type: "spring", duration: 1 }}>
			<h2>{t("headerEditDocument")}</h2>
			<FontAwesomeIcon
				id={css.close}
				icon={faXmark}
				onClick={() => {
					setVisible((prev) => !prev);
				}}
			/>
			<form onSubmit={handleSubmit(onSubmit)}>
				<InputBox
					placeholder={t("placeholderDocumentTitle")}
					register={register}
					type="text"
					name="title"
					icon={faHeading}
					isRequired={true}
					defaultValue={editedDocument.title}
				/>
				<InputBox
					placeholder={t("placeholderDocumentDescription")}
					register={register}
					type="text"
					name="description"
					icon={faInfo}
					defaultValue={editedDocument.description}
				/>
				<Select
					name="category_id"
					options={categories}
					register={register}
					placeholderValue={t("placeholderCategorySelect")}
					icon={faHashtag}
					defaultValue={editedDocument.category_id}
				/>
				<ImageInput image={editedDocument.image} name="image" path="documents" register={register} title="Náhledový obrázek" required={false} />
				<FileInput fileName={editedDocument.name} name="file" register={register} title="Uložený dokument" />
				<DatePicker
					register={register}
					name="date"
					title={t("placeholderDocumentDate")}
					icon={faCalendarDays}
					defaultValue={makeDateFormat(editedDocument.date, "str")}
				/>
				<button>{t("buttonSave")}</button>
			</form>
		</motion.section>
	);
}
