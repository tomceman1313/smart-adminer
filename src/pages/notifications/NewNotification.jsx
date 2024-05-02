import {
	faGlobe,
	faHeading,
	faQuoteRight,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DatePicker from "../../components/basic/DatePicker";
import InputBox from "../../components/basic/InputBox";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import { makeDateFormat } from "../../modules/BasicFunctions";
import warningToast from "../../components/common/warning-toast/WarningToast";

import css from "./Notifications.module.css";

export default function NewNotification({
	loadData,
	setShowCreateNotification,
}) {
	const { t } = useTranslation("notifications");
	const { create } = useBasicApiFunctions();

	const { register, handleSubmit, reset } = useForm();

	async function onSubmitCreate(data) {
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);
		data.path = data.path.replace(" ", "");

		if (Number(data.start) > Number(data.end)) {
			warningToast(t("messageInvalidDates"));
			return;
		}

		await create("notifications", data, t("positiveTextNotificationCreated"));
		setShowCreateNotification(false);
		loadData();
	}

	function hide() {
		reset();
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
			<form onSubmit={handleSubmit(onSubmitCreate)}>
				<h2>{t("headerNewNotification")}</h2>

				<InputBox
					type="text"
					name="title"
					icon={faHeading}
					placeholder={t("placeholderTitle")}
					register={register}
					white={true}
					isRequired={true}
				/>
				<InputBox
					type="text"
					name="path"
					icon={faGlobe}
					placeholder={t("placeholderUrl")}
					register={register}
					white={true}
					isRequired={true}
				/>
				<InputBox
					type="text"
					name="text"
					icon={faQuoteRight}
					placeholder={t("placeholderText")}
					register={register}
					white={true}
					isRequired={true}
				/>
				<DatePicker
					name="start"
					register={register}
					white={true}
					isRequired={true}
					placeholder={t("placeholderDateStart")}
					additionalClasses="half green"
				/>
				<DatePicker
					name="end"
					register={register}
					white={true}
					isRequired={true}
					placeholder={t("placeholderDateEnd")}
					additionalClasses="half green"
				/>
				<button type="submit">{t("buttonCreate")}</button>
			</form>
		</motion.div>
	);
}
