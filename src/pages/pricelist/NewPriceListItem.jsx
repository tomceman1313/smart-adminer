import { useForm } from "react-hook-form";
import { makeDateFormat } from "../../modules/BasicFunctions";
import { faXmark, faTag, faTags, faHeading } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuth from "../../hooks/useAuth";
import useInteraction from "../../hooks/useInteraction";
import { create } from "../../modules/ApiFunctions";
import { motion } from "framer-motion";
import InputBox from "../../components/basic/InputBox";
import DatePicker from "../../components/basic/DatePicker";

import css from "./Pricelist.module.css";
import { useTranslation } from "react-i18next";

export default function NewPriceListItem({ loadData, close }) {
	const auth = useAuth();
	const { t } = useTranslation("priceList");

	const { setMessage } = useInteraction();

	const { register, handleSubmit, reset } = useForm();

	async function onSubmitCreate(data) {
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);
		if (data.special_price !== "" && (data.start === "0" || data.end === "0")) {
			setMessage({ action: "alert", text: t("alertMissingSpecialPriceDate") });
			return;
		}

		if (data.special_price === "") {
			data.start = "";
			data.end = "";
		}

		if (Number(data.start) > Number(data.end)) {
			setMessage({ action: "alert", text: t("alertInvalidSpecialPriceDate") });
			return;
		}
		await create("pricelist", data, setMessage, t("positiveTextItemCreated"), auth);
		reset();
		close();
		loadData();
	}

	return (
		<motion.div className={css.add_item} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.7 }}>
			<FontAwesomeIcon id={css.close} icon={faXmark} onClick={close} />
			<form onSubmit={handleSubmit(onSubmitCreate)}>
				<h2>{t("headerNewItem")}</h2>
				<InputBox type="text" name="name" icon={faHeading} placeholder={t("placeholderName")} register={register} white={true} isRequired={true} />

				<InputBox
					type="text"
					name="price"
					icon={faTag}
					placeholder={t("placeholderPrice")}
					register={register}
					white={true}
					isRequired={true}
					additionalClasses="half"
				/>

				<InputBox
					type="text"
					name="special_price"
					icon={faTags}
					placeholder={t("placeholderSpecialPrice")}
					register={register}
					white={true}
					additionalClasses="half"
				/>

				<DatePicker name="start" register={register} white={true} placeholder={t("placeholderStartDate")} additionalClasses="half green" />
				<DatePicker name="end" register={register} white={true} placeholder={t("placeholderEndDate")} additionalClasses="half green" />
				<button type="submit">{t("buttonCreate")}</button>
			</form>
		</motion.div>
	);
}
