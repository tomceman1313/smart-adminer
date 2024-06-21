import {
	faHeading,
	faTag,
	faTags,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DatePicker from "../../components/basic/DatePicker";
import InputBox from "../../components/basic/InputBox";
import Form from "../../components/basic/form/Form";
import { useDelete, useUpdate } from "../../hooks/api/useCRUD";
import useInteraction from "../../hooks/useInteraction";
import { makeDateFormat } from "../../modules/BasicFunctions";
import { priceListItemSchema } from "../../schemas/zodSchemas";
import css from "./Pricelist.module.css";

export default function EditPriceItem({ priceItem, setPriceItem }) {
	const { t } = useTranslation("priceList", "validationErrors");
	const { setAlert } = useInteraction();
	const formMethods = useForm({
		resolver: zodResolver(priceListItemSchema(t)),
	});

	const { mutateAsync: edit } = useUpdate(
		"pricelist",
		t("positiveTextItemUpdated"),
		null,
		["priceList"]
	);

	const { mutateAsync: remove } = useDelete(
		"pricelist",
		t("positiveTextItemDeleted"),
		null,
		["priceList"]
	);

	useEffect(() => {
		if (priceItem) {
			formMethods.setValue("id", priceItem.id);
			formMethods.setValue("name", priceItem.name);
			formMethods.setValue("price", priceItem.price.toString());
			if (priceItem.special_price) {
				formMethods.setValue(
					"special_price",
					priceItem.special_price.toString()
				);
			}
			formMethods.setValue(
				"start",
				makeDateFormat(priceItem.special_price_start, "str")
			);
			formMethods.setValue(
				"end",
				makeDateFormat(priceItem.special_price_end, "str")
			);
		}
	}, [priceItem, formMethods]);

	async function onSubmit(data) {
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);

		if (data.special_price === "") {
			data.start = "";
			data.end = "";
		}

		await edit(data);
		close();
	}

	async function deleteHandler(id) {
		await remove(id);
		close();
	}

	function close() {
		setPriceItem(false);
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
			<Form onSubmit={onSubmit} formContext={formMethods}>
				<h2>{t("headerEditItem")}</h2>
				<InputBox
					type="text"
					name="name"
					icon={faHeading}
					placeholder={t("placeholderName")}
					white={true}
				/>

				<InputBox
					type="text"
					name="price"
					icon={faTag}
					placeholder={t("placeholderPrice")}
					white={true}
					additionalClasses="half"
				/>

				<InputBox
					type="text"
					name="special_price"
					icon={faTags}
					placeholder={t("placeholderSpecialPrice")}
					white={true}
					additionalClasses="half"
				/>

				<DatePicker
					name="start"
					white={true}
					placeholder={t("placeholderStartDate")}
					additionalClasses="half blue"
				/>
				<DatePicker
					name="end"
					white={true}
					placeholder={t("placeholderEndDate")}
					additionalClasses="half blue"
				/>

				<input type="hidden" {...formMethods.register("id")} />
				<button>{t("buttonSave")}</button>
				<button
					type="button"
					className="red_button"
					onClick={() =>
						setAlert({
							id: priceItem.id,
							question: t("alertDeleteItem", { name: priceItem.name }),
							positiveHandler: deleteHandler,
						})
					}
				>
					{t("buttonDelete")}
				</button>
			</Form>
		</motion.div>
	);
}
