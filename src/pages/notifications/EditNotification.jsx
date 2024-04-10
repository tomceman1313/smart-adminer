import { useEffect } from "react";
import { edit, remove } from "../../modules/ApiFunctions";
import { faXmark, faHeading, faGlobe, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useInteraction from "../../hooks/useInteraction";
import { useTranslation } from "react-i18next";
import { makeDateFormat } from "../../modules/BasicFunctions";
import InputBox from "../../components/basic/InputBox";
import DatePicker from "../../components/basic/DatePicker";

import css from "./Notifications.module.css";

export default function EditNotification({ notification, loadData, setEditNotification }) {
	const auth = useAuth();
	const { t } = useTranslation("notifications");

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
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);
		data.path = data.path.replaceAll(" ", "");

		if (data.start > data.end) {
			setMessage({ action: "alert", text: t("messageInvalidDates"), timeout: 6000 });
			return;
		}

		await edit("notifications", data, setMessage, t("positiveTextNotificationUpdated"), auth);
		setEditNotification(false);
		loadData();
	}

	async function deleteHandler(id) {
		await remove("notifications", id, setMessage, t("positiveTextNotificationDeleted"), auth);
		reset();
		setEditNotification(false);
		loadData();
	}

	const deleteNotification = () => {
		setAlert({ id: notification.id, question: t("alertDeleteNotification"), positiveHandler: deleteHandler });
	};

	return (
		<AnimatePresence>
			{notification && (
				<motion.div className={css.edit_notification} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.7 }}>
					<FontAwesomeIcon id={css.close} icon={faXmark} onClick={() => setEditNotification(false)} />
					<form onSubmit={handleSubmitUpdate(onSubmit)}>
						<h2>{t("headerEditNotification")}</h2>
						<InputBox
							type="text"
							name="title"
							icon={faHeading}
							placeholder={t("placeholderTitle")}
							register={registerUpdate}
							white={true}
							isRequired={true}
						/>

						<InputBox
							type="text"
							name="path"
							icon={faGlobe}
							placeholder={t("placeholderUrl")}
							register={registerUpdate}
							white={true}
							isRequired={true}
						/>

						<InputBox
							type="text"
							name="text"
							icon={faQuoteRight}
							placeholder={t("placeholderText")}
							register={registerUpdate}
							white={true}
							isRequired={true}
						/>

						<DatePicker
							name="start"
							register={registerUpdate}
							white={true}
							isRequired={true}
							placeholder={t("placeholderDateStart")}
							additionalClasses="half blue"
						/>
						<DatePicker
							name="end"
							register={registerUpdate}
							white={true}
							isRequired={true}
							placeholder={t("placeholderDateEnd")}
							additionalClasses="half blue"
						/>

						<input type="hidden" {...registerUpdate("id")} />
						<button>{t("buttonSave")}</button>

						<button type="button" className="red_button" onClick={deleteNotification}>
							{t("buttonDelete")}
						</button>
					</form>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
