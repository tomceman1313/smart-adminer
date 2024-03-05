import { faCalendarDays, faHashtag, faHeading, faInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import DatePicker from "../../Components/basic/DatePicker";
import InputBox from "../../Components/basic/InputBox";
import FileInput from "../../Components/basic/file-input/FIleInput";
import ImageInput from "../../Components/basic/image-input/ImageInput";
import Select from "../../Components/basic/select/Select";
import useInteraction from "../../Hooks/useInteraction";
import { edit } from "../../modules/ApiFunctions";
import { convertBase64, makeDateFormat } from "../../modules/BasicFunctions";
import css from "./css/EditDocument.module.css";

export default function EditDocument({ editedDocument, auth, refreshData, categories, setVisible }) {
	const { setMessage } = useInteraction();
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

		await edit("documents", data, setMessage, "Soubor upraven", auth);
		reset();
		refreshData();
		setVisible(false);
	};

	return (
		<motion.section className={css.edit} initial={{ x: -600 }} animate={{ x: 0 }} exit={{ x: -600 }} transition={{ type: "spring", duration: 1 }}>
			<h2>Úprava souboru</h2>
			<FontAwesomeIcon
				id={css.close}
				icon={faXmark}
				onClick={() => {
					setVisible((prev) => !prev);
				}}
			/>
			<form onSubmit={handleSubmit(onSubmit)}>
				<InputBox
					placeholder="Název"
					register={register}
					type="text"
					name="title"
					icon={faHeading}
					isRequired={true}
					defaultValue={editedDocument.title}
				/>
				<InputBox placeholder="Popisek" register={register} type="text" name="description" icon={faInfo} defaultValue={editedDocument.description} />
				<Select
					name="category_id"
					options={categories}
					register={register}
					placeholderValue="-- Přiřadit kategorii --"
					icon={faHashtag}
					defaultValue={editedDocument.category_id}
				/>
				<ImageInput image={editedDocument.image} name="image" path="documents" register={register} title="Náhledový obrázek" required={false} />
				<FileInput fileName={editedDocument.name} name="file" register={register} title="Uložený dokument" />
				<DatePicker
					register={register}
					name="date"
					title="Datum přidání"
					icon={faCalendarDays}
					defaultValue={makeDateFormat(editedDocument.date, "str")}
				/>
				<button>Uložit</button>
			</form>
		</motion.section>
	);
}
