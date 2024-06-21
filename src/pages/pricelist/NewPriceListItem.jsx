import {
	faHeading,
	faTag,
	faTags,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import DatePicker from "../../components/basic/DatePicker";
import InputBox from "../../components/basic/InputBox";
import Form from "../../components/basic/form/Form";
import { useCreate } from "../../hooks/api/useCRUD";
import { makeDateFormat } from "../../modules/BasicFunctions";
import { priceListItemSchema } from "../../schemas/zodSchemas";
import css from "./Pricelist.module.css";

export default function NewPriceListItem({ close }) {
	const { t } = useTranslation("priceList", "validationErrors");
	const { mutateAsync: create } = useCreate(
		"pricelist",
		t("positiveTextItemCreated"),
		null,
		["priceList"]
	);

	async function onSubmitCreate(data) {
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);

		if (data.special_price === "") {
			data.start = "";
			data.end = "";
		}

		await create(data);
		close();
	}

	return (
		<motion.div
			className={css.add_item}
			initial={{ y: "100%" }}
			animate={{ y: 0 }}
			exit={{ y: "100%" }}
			transition={{ duration: 0.7 }}
		>
			<FontAwesomeIcon id={css.close} icon={faXmark} onClick={close} />
			<Form onSubmit={onSubmitCreate} validationSchema={priceListItemSchema(t)}>
				<h2>{t("headerNewItem")}</h2>
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
					additionalClasses="half green"
				/>
				<DatePicker
					name="end"
					white={true}
					placeholder={t("placeholderEndDate")}
					additionalClasses="half green"
				/>
				<button type="submit">{t("buttonCreate")}</button>
			</Form>
		</motion.div>
	);
}
