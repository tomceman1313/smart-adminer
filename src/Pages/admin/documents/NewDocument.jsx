import { faFile, faHashtag, faHeading, faImage, faInfo, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InputBox from "../../Components/basic/InputBox";
import useInteraction from "../../Hooks/useInteraction";
import { create } from "../../modules/ApiFunctions";
import { convertBase64, makeDate, makeDateFormat } from "../../modules/BasicFunctions";

import { AnimatePresence } from "framer-motion";
import cssBasic from "../styles/Basic.module.css";
import AddMultipleFiles from "./AddMultipleFiles";
import Select from "../../Components/basic/select/Select";

const NewDocument = ({ auth, refreshData, categories }) => {
	const { setMessage } = useInteraction();
	const [addMultiplePictures, setAddMultiplePictures] = useState(null);

	const { register, handleSubmit, reset } = useForm();

	const createNew = async (data) => {
		const fileName = data.file[0].name.split(".");
		if (data.file[0]) {
			const base64 = await convertBase64(data.file[0]);
			data.file = base64;
			data.file_name = fileName[0];
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
		await create("documents", data, setMessage, "Soubor vložen", auth);
		reset();
		refreshData();
	};

	const showAddMultiplePictures = () => {
		setAddMultiplePictures(true);
	};

	return (
		<>
			<section>
				<h2>Nový soubor</h2>
				<form onSubmit={handleSubmit(createNew)}>
					<InputBox placeholder="Název" register={register} type="text" name="title" icon={faHeading} isRequired={true} />
					<InputBox placeholder="Popisek" register={register} type="text" name="description" icon={faInfo} isRequired={false} />
					<Select name="category_id" options={categories} register={register} placeholderValue="-- Přiřadit kategorii --" icon={faHashtag} />

					<InputBox placeholder="Soubor" register={register} type="file" name="image" icon={faImage} isRequired={false} accept="image/*" />
					<InputBox placeholder="Soubor" register={register} type="file" name="file" icon={faFile} isRequired={true} accept="*" />
					<div className={cssBasic.input_box} title="Datum zveřejnění">
						<input type="date" {...register("date")} />
						<FontAwesomeIcon className={cssBasic.icon} icon={faCalendarDays} />
					</div>

					<button>Vložit</button>
					<button type="button" className="blue_button" onClick={showAddMultiplePictures}>
						Vložit více
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
