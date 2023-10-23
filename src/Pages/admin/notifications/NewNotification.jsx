import { create } from "../../modules/ApiFunctions";
import css from "./Notifications.module.css";

import { faXmark, faHeading, faGlobe, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { makeDateFormat } from "../../modules/BasicFunctions";
import InputBox from "../../Components/basic/InputBox";
import DatePicker from "../../Components/basic/DatePicker";

export default function NewNotification({ loadData, setShowCreateNotification }) {
	const auth = useAuth();

	const { setMessage } = useInteraction();

	const { register, handleSubmit, reset } = useForm();

	async function onSubmitCreate(data) {
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);
		if (Number(data.start) > Number(data.end)) {
			setMessage({ action: "alert", text: "Datum začátku a konce akční ceny je zadáno nesprávně" });
			return;
		}

		await create("notifications", data, setMessage, "Upozornění vytvořeno", auth);
		setShowCreateNotification(false);
		loadData();
	}

	function hide() {
		reset();
		setShowCreateNotification(false);
	}

	return (
		<motion.div className={css.add_notification} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.7 }}>
			<FontAwesomeIcon id={css.close} icon={faXmark} onClick={hide} />
			<form onSubmit={handleSubmit(onSubmitCreate)}>
				<h2>Nová notifikace</h2>

				<InputBox type="text" name="title" icon={faHeading} placeholder="Nadpis" register={register} white={true} isRequired={true} />
				<InputBox type="text" name="path" icon={faGlobe} placeholder="Url adresa" register={register} white={true} isRequired={true} />
				<InputBox type="text" name="text" icon={faQuoteRight} placeholder="Text upozornění" register={register} white={true} isRequired={true} />
				<DatePicker name="start" register={register} white={true} isRequired={true} placeholder="Počáteční datum" additionalClasses="half green" />
				<DatePicker name="end" register={register} white={true} isRequired={true} placeholder="Konečné datum" additionalClasses="half green" />
				<button type="submit">Uložit</button>
			</form>
		</motion.div>
	);
}
