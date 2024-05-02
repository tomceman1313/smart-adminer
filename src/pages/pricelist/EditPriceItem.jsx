import {
	faHeading,
	faTag,
	faTags,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import DatePicker from "../../components/basic/DatePicker";
import InputBox from "../../components/basic/InputBox";
import useInteraction from "../../hooks/useInteraction";
import { makeDateFormat } from "../../modules/BasicFunctions";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import warningToast from "../../components/common/warning-toast/WarningToast";
import css from "./Pricelist.module.css";

export default function EditPriceItem({ priceItem, setPriceItem, loadData }) {
	const { t } = useTranslation("priceList");
	const { edit, remove } = useBasicApiFunctions();
	const { setAlert } = useInteraction();
	const { register, handleSubmit, setValue, reset } = useForm();

	useEffect(() => {
		if (priceItem) {
			setValue("id", priceItem.id);
			setValue("name", priceItem.name);
			setValue("price", priceItem.price);
			setValue(
				"special_price",
				priceItem.special_price !== 0 ? priceItem.special_price : ""
			);
			setValue("start", makeDateFormat(priceItem.special_price_start, "str"));
			setValue("end", makeDateFormat(priceItem.special_price_end, "str"));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [priceItem]);

	async function onSubmit(data) {
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);
		if (data.special_price !== "" && (data.start === "0" || data.end === "0")) {
			warningToast(t("alertMissingSpecialPriceDate"));
			return;
		}

		if (data.special_price === "") {
			data.start = "";
			data.end = "";
		}

		if (Number(data.start) > Number(data.end)) {
			warningToast(t("alertInvalidSpecialPriceDate"));
			return;
		}
		await edit("pricelist", data, t("positiveTextItemUpdated"));
		close();
		loadData();
	}

	function close() {
		setPriceItem(false);
		reset();
	}

	async function deleteHandler(id) {
		await remove("pricelist", id, t("positiveTextItemDeleted"));
		close();
		loadData();
	}

	function deleteItem() {
		setAlert({
			id: priceItem.id,
			question: t("alertDeleteItem", { name: priceItem.name }),
			positiveHandler: deleteHandler,
		});
	}

	return (
		<motion.div
			className={css.edit_price}
			initial={{ y: "100%" }}
			animate={{ y: 0 }}
			exit={{ y: "100%" }}
			transition={{ duration: 0.7 }}
		>
			<FontAwesomeIcon id={css.close} icon={faXmark} onClick={close} />
			<form onSubmit={handleSubmit(onSubmit)}>
				<h2>{t("headerEditItem")}</h2>

				<InputBox
					type="text"
					name="name"
					icon={faHeading}
					placeholder={t("placeholderName")}
					register={register}
					white={true}
					isRequired={true}
				/>

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

				<DatePicker
					name="start"
					register={register}
					white={true}
					placeholder={t("placeholderStartDate")}
					additionalClasses="half blue"
				/>
				<DatePicker
					name="end"
					register={register}
					white={true}
					placeholder={t("placeholderEndDate")}
					additionalClasses="half blue"
				/>

				<input type="hidden" {...register("id")} />
				<button>{t("buttonSave")}</button>
				<button type="button" className="red_button" onClick={deleteItem}>
					{t("buttonDelete")}
				</button>
			</form>
		</motion.div>
	);
}
