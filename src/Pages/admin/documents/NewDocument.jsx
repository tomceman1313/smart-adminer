import { faHashtag, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InputBox from "../../Components/basic/InputBox";
import useInteraction from "../../Hooks/useInteraction";
import { create, getAll } from "../../modules/ApiFunctions";
import { convertBase64, makeDate } from "../../modules/BasicFunctions";

import { AnimatePresence } from "framer-motion";
import cssBasic from "../styles/Basic.module.css";
import AddMultipleFiles from "./AddMultipleFiles";

const NewDocument = ({ auth, setDocuments, categories }) => {
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
		const date = new Date();
		data.date = makeDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
		await create("documents", data, setMessage, "Soubor vložen", auth);
		reset();
		getAll("documents", setDocuments, auth);
	};

	const showAddMultiplePictures = () => {
		setAddMultiplePictures(true);
	};

	return (
		<>
			<section>
				<h2>Nový soubor</h2>
				<form onSubmit={handleSubmit(createNew)}>
					<div className={cssBasic.input_box}>
						<select defaultValue={"default"} {...register("category_id")} required>
							<option value="default" disabled>
								-- Přiřadit kategorii --
							</option>
							{categories &&
								categories.map((el) => (
									<option key={el.id} value={el.id}>
										{el.name}
									</option>
								))}
						</select>
						<FontAwesomeIcon className={cssBasic.icon} icon={faHashtag} />
					</div>

					<InputBox placeholder="Soubor" register={register} type="file" name="file" icon={faImage} isRequired={true} accept="*" />

					<button>Vložit</button>
					<button type="button" className="blue_button" onClick={showAddMultiplePictures}>
						Vložit více
					</button>
				</form>
			</section>

			<AnimatePresence>
				{addMultiplePictures && (
					<AddMultipleFiles auth={auth} close={() => setAddMultiplePictures(false)} refreshFiles={() => getAll("documents", setDocuments, auth)} />
				)}
			</AnimatePresence>
		</>
	);
};

export default NewDocument;
