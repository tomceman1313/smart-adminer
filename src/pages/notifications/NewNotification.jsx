import {
	faGlobe,
	faHeading,
	faQuoteRight,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import DatePicker from "../../components/basic/DatePicker";
import InputBox from "../../components/basic/InputBox";
import Form from "../../components/basic/form/Form";
import { makeDateFormat } from "../../modules/BasicFunctions";
import { notificationSchema } from "../../schemas/zodSchemas";

import { useCreate } from "../../hooks/api/useCRUD";
import css from "./Notifications.module.css";

export default function NewNotification({ setShowCreateNotification }) {
	const { t } = useTranslation("notifications", "errors", "validationErrors");

	const { mutateAsync: create } = useCreate(
		"notifications",
		t("positiveTextNotificationCreated"),
		t("errors:errorCRUDOperation"),
		["notifications"]
	);

	async function onSubmitCreate(data) {
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);
		data.path = data.path.replace(" ", "");

		await create(data);
		setShowCreateNotification(false);
	}

	function hide() {
		setShowCreateNotification(false);
	}

	return (
		<motion.div
			className={css.add_notification}
			initial={{ y: "100%" }}
			animate={{ y: 0 }}
			exit={{ y: "100%" }}
			transition={{ duration: 0.7 }}
		>
			<FontAwesomeIcon id={css.close} icon={faXmark} onClick={hide} />
			<Form onSubmit={onSubmitCreate} validationSchema={notificationSchema(t)}>
				<h2>{t("headerNewNotification")}</h2>
				<InputBox
					type="text"
					name="title"
					icon={faHeading}
					placeholder={t("placeholderTitle")}
					white={true}
				/>
				<InputBox
					type="text"
					name="path"
					icon={faGlobe}
					placeholder={t("placeholderUrl")}
					white={true}
				/>
				<InputBox
					type="text"
					name="text"
					icon={faQuoteRight}
					placeholder={t("placeholderText")}
					white={true}
				/>
				<DatePicker
					name="start"
					white={true}
					placeholder={t("placeholderDateStart")}
					additionalClasses="half green"
				/>
				<DatePicker
					name="end"
					white={true}
					placeholder={t("placeholderDateEnd")}
					additionalClasses="half green"
				/>
				<button type="submit">{t("buttonCreate")}</button>
			</Form>
		</motion.div>
	);
}
