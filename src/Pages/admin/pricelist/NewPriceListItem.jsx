import { useForm } from "react-hook-form";
import { makeDateFormat } from "../../modules/BasicFunctions";
import { faXmark, faTag, faTags, faHeading } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { create } from "../../modules/ApiFunctions";
import { motion } from "framer-motion";
import InputBox from "../../Components/basic/InputBox";
import DatePicker from "../../Components/basic/DatePicker";

import css from "./Pricelist.module.css";

export default function NewPriceListItem({ loadData, close }) {
	const auth = useAuth();

	const { setMessage } = useInteraction();

	const { register, handleSubmit, reset } = useForm();

	async function onSubmitCreate(data) {
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);
		if (data.start > data.end) {
			setMessage({ action: "alert", text: "Datum začátku a konce akční ceny je zadáno nesprávně" });
			return;
		}
		await create("pricelist", data, setMessage, "Položka přidána", auth);
		reset();
		close();
		loadData();
	}

	return (
		<motion.div className={css.add_item} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.7 }}>
			<FontAwesomeIcon id={css.close} icon={faXmark} onClick={close} />
			<form onSubmit={handleSubmit(onSubmitCreate)}>
				<h2>Nová položka</h2>
				<InputBox type="text" name="name" icon={faHeading} placeholder="Název položky" register={register} white={true} isRequired={true} />

				<InputBox
					type="text"
					name="price"
					icon={faTag}
					placeholder="Cena"
					register={register}
					white={true}
					isRequired={true}
					additionalClasses="half"
				/>

				<InputBox
					type="text"
					name="special_price"
					icon={faTags}
					placeholder="Akční cena"
					register={register}
					white={true}
					isRequired={true}
					additionalClasses="half"
				/>

				<DatePicker name="start" register={register} white={true} isRequired={true} placeholder="Počáteční datum" additionalClasses="half green" />
				<DatePicker name="end" register={register} white={true} isRequired={true} placeholder="Konečné datum" additionalClasses="half green" />
				<button type="submit">Uložit</button>
			</form>
		</motion.div>
	);
}
