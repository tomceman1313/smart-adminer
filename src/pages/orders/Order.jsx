import React from "react";
import { makeDateFormat } from "../../modules/BasicFunctions";
import { useTranslation } from "react-i18next";

export default function Order({ el, setOrderId }) {
	const { t } = useTranslation("orders");
	return (
		<>
			<li onClick={() => setOrderId(el.id)}>
				<label>{el.id}</label>
				<label>{t(el.status_name)}</label>
				<label>{makeDateFormat(el.order_date, "text")}</label>
				<label>{el.shipping_type}</label>
				<label>{`${el.price_sum} Kč`}</label>
			</li>
		</>
	);
}
