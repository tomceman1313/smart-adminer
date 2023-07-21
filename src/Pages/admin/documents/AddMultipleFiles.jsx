import { faHashtag, faXmark, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { multipleCreate } from "../../modules/ApiDocuments";
import { getCategories } from "../../modules/ApiCategories";
import useInteraction from "../../Hooks/useInteraction";
import { convertBase64, makeDate } from "../../modules/BasicFunctions";

import cssBasic from "../styles/Basic.module.css";
import css from "./css/Documents.module.css";

const AddMultipleFiles = ({ auth, close, refreshFiles }) => {
	const { setMessage } = useInteraction();
	const [category, setCategory] = useState(null);
	const { register, handleSubmit, reset } = useForm();

	useEffect(() => {
		getCategories(setCategory, "documents");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (data) => {
		let filesArray = [];
		for (const file of data.files) {
			const fileName = file.name.split(".");
			const base64 = await convertBase64(file);
			filesArray.push({ filename: fileName[0], file: base64 });
		}
		data.files = filesArray;
		const date = new Date();
		data.date = makeDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

		await multipleCreate(data, auth);
		setMessage({ action: "success", text: "Soubory byly přidány" });
		reset();
		refreshFiles();
		close();
	};

	return (
		<motion.section
			className={css.add_files_cont}
			initial={{ y: "-250%", x: "-50%" }}
			animate={{ y: "-50%" }}
			exit={{ y: "-250%" }}
			transition={{ type: "spring", duration: 1 }}
		>
			<FontAwesomeIcon className={css.close_btn} icon={faXmark} onClick={close} />
			<h2>Přidání souborů</h2>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={`${cssBasic.input_box} ${cssBasic.white_color}`}>
					<select defaultValue={"default"} {...register("category_id")} required>
						<option value="default" disabled>
							-- Přiřadit kategorii --
						</option>
						{category &&
							category.map((el) => (
								<option key={el.id} value={el.id}>
									{el.name}
								</option>
							))}
					</select>
					<FontAwesomeIcon className={cssBasic.icon} icon={faHashtag} />
				</div>

				<div className={`${cssBasic.input_box} ${cssBasic.white_color}`}>
					<input type="file" accept="*" {...register("files")} multiple />
					<FontAwesomeIcon className={cssBasic.icon} icon={faImage} />
				</div>

				<button>Uložit</button>
			</form>
		</motion.section>
	);
};

export default AddMultipleFiles;
