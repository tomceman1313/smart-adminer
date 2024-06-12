import {
	faGlobe,
	faHeading,
	faQuoteRight,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DatePicker from "../../components/basic/DatePicker";
import InputBox from "../../components/basic/InputBox";
import Form from "../../components/basic/form/Form";
import { useDelete, useUpdate } from "../../hooks/api/useCRUD";
import useInteraction from "../../hooks/useInteraction";
import { makeDateFormat } from "../../modules/BasicFunctions";
import { notificationSchema } from "../../schemas/zodSchemas";
import css from "./Notifications.module.css";

export default function EditNotification({
	notification,
	setEditNotification,
}) {
	const { t } = useTranslation("notifications", "errors", "validationErrors");
	const { setAlert } = useInteraction();

	const formMethods = useForm({
		resolver: zodResolver(notificationSchema(t)),
	});

	const { mutateAsync: edit } = useUpdate(
		"notifications",
		t("positiveTextNotificationUpdated"),
		t("errors:errorCRUDOperation"),
		["notifications"]
	);

	const { mutateAsync: remove } = useDelete(
		"notifications",
		t("positiveTextNotificationDeleted"),
		t("errors:errorCRUDOperation"),
		["notifications"]
	);

	async function onSubmit(data) {
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);
		data.path = data.path.replaceAll(" ", "");

		await edit(data);
		setEditNotification(false);
	}

	async function deleteHandler(id) {
		await remove(id);
		formMethods.reset();
		setEditNotification(false);
	}

	return (
		<AnimatePresence>
			{notification && (
				<motion.div
					className={css.edit_notification}
					initial={{ y: "100%" }}
					animate={{ y: 0 }}
					exit={{ y: "100%" }}
					transition={{ duration: 0.7 }}
				>
					<FontAwesomeIcon
						id={css.close}
						icon={faXmark}
						onClick={() => setEditNotification(false)}
					/>
					<Form onSubmit={onSubmit} formContext={formMethods}>
						<h2>{t("headerEditNotification")}</h2>
						<InputBox
							type="text"
							name="title"
							icon={faHeading}
							defaultValue={notification.title}
							placeholder={t("placeholderTitle")}
							white={true}
							isRequired={true}
						/>

						<InputBox
							type="text"
							name="path"
							icon={faGlobe}
							defaultValue={notification.path}
							placeholder={t("placeholderUrl")}
							white={true}
							isRequired={true}
						/>

						<InputBox
							type="text"
							name="text"
							icon={faQuoteRight}
							defaultValue={notification.text}
							placeholder={t("placeholderText")}
							white={true}
							isRequired={true}
						/>

						<DatePicker
							name="start"
							white={true}
							isRequired={true}
							defaultValue={makeDateFormat(notification.start, "str")}
							placeholder={t("placeholderDateStart")}
							additionalClasses="half blue"
						/>
						<DatePicker
							name="end"
							white={true}
							isRequired={true}
							defaultValue={makeDateFormat(notification.end, "str")}
							placeholder={t("placeholderDateEnd")}
							additionalClasses="half blue"
						/>

						<input
							type="hidden"
							defaultValue={notification.id}
							{...formMethods.register("id")}
						/>

						<button>{t("buttonSave")}</button>

						<button
							type="button"
							className="red_button"
							onClick={() =>
								setAlert({
									id: notification.id,
									question: t("alertDeleteNotification"),
									positiveHandler: deleteHandler,
								})
							}
						>
							{t("buttonDelete")}
						</button>
					</Form>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
