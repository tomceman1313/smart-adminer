import { edit, remove } from "../../modules/ApiFunctions";
import css from "./Notifications.module.css";

import { faXmark, faHeading, faGlobe, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { makeDateFormat } from "../../modules/BasicFunctions";
import InputBox from "../../Components/basic/InputBox";
import DatePicker from "../../Components/basic/DatePicker";
import { useEffect } from "react";

export default function EditNotification({ notification, loadData, setEditNotification }) {
	const auth = useAuth();

	const { register: registerUpdate, handleSubmit: handleSubmitUpdate, reset, setValue } = useForm();
	const { setAlert, setMessage } = useInteraction();

	useEffect(() => {
		if (!notification) {
			return;
		}
		setValue("id", notification.id);
		setValue("title", notification.title);
		setValue("path", notification.path);
		setValue("text", notification.text);
		setValue("start", makeDateFormat(notification.start, "str"));
		setValue("end", makeDateFormat(notification.end, "str"));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notification]);

	async function onSubmit(data) {
		//FIXME check if path does not contain whitespace
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);

		if (data.start > data.end) {
			setMessage({ action: "alert", text: "Datum začátku a konce akční ceny je zadáno nesprávně", timeout: 6000 });
			return;
		}

		await edit("notifications", data, setMessage, "Upozornění bylo upraveno", auth);
		setEditNotification(false);
		loadData();
	}

	async function deleteHandler(id) {
		await remove("notifications", id, setMessage, "Upozornění bylo odstřaněna", auth);
		reset();
		setEditNotification(false);
		loadData();
	}

	const deleteNotification = () => {
		setAlert({ id: notification.id, question: "Smazat notifikaci?", positiveHandler: deleteHandler });
	};

	return (
		<AnimatePresence>
			{notification && (
				<motion.div className={css.edit_notification} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.7 }}>
					<FontAwesomeIcon id={css.close} icon={faXmark} onClick={() => setEditNotification(false)} />
					<form onSubmit={handleSubmitUpdate(onSubmit)}>
						<h2>Úprava upozornění</h2>
						<InputBox type="text" name="title" icon={faHeading} placeholder="Nadpis" register={registerUpdate} white={true} isRequired={true} />

						<InputBox type="text" name="path" icon={faGlobe} placeholder="Url adresa" register={registerUpdate} white={true} isRequired={true} />

						<InputBox
							type="text"
							name="text"
							icon={faQuoteRight}
							placeholder="Text upozornění"
							register={registerUpdate}
							white={true}
							isRequired={true}
						/>

						<DatePicker
							name="start"
							register={registerUpdate}
							white={true}
							isRequired={true}
							placeholder="Počáteční datum"
							additionalClasses="half blue"
						/>
						<DatePicker
							name="end"
							register={registerUpdate}
							white={true}
							isRequired={true}
							placeholder="Konečné datum"
							additionalClasses="half blue"
						/>

						<input type="hidden" {...registerUpdate("id")} />
						<button>Uložit</button>

						<button type="button" className="red_button" onClick={deleteNotification}>
							Smazat
						</button>
					</form>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
