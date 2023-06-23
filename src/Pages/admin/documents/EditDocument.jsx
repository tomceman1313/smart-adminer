import { faCalendarDays, faHashtag, faHeading, faInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import InputBox from "../../Components/basic/InputBox";
import useInteraction from "../../Hooks/useInteraction";
import { edit } from "../../modules/ApiFunctions";
import { makeDateFormat } from "../../modules/BasicFunctions";

import { motion } from "framer-motion";
import cssBasic from "../styles/Basic.module.css";
import css from "./css/EditDocument.module.css";

export default function EditDocument({ editedDocument, auth, refreshData, categories, setVisible }) {
	const { setMessage } = useInteraction();

	const { register, handleSubmit, reset, setValue } = useForm();

	useEffect(() => {
		setValue("title", editedDocument?.title);
		setValue("description", editedDocument?.description);
		setValue("category_id", editedDocument?.category_id);
		setValue("date", makeDateFormat(editedDocument?.date, "str"));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (data) => {
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
				<InputBox placeholder="Název" register={register} type="text" name="title" icon={faHeading} isRequired={false} />
				<InputBox placeholder="Popisek" register={register} type="text" name="description" icon={faInfo} isRequired={false} />
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

				<div className={cssBasic.input_box} title="Datum vložení">
					<input type="date" {...register("date")} />
					<FontAwesomeIcon className={cssBasic.icon} icon={faCalendarDays} />
				</div>

				<button>Uložit</button>
			</form>
		</motion.section>
	);
}
