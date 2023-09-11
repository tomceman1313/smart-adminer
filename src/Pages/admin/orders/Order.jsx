import React from "react";
import { makeDateFormat } from "../../modules/BasicFunctions";

export default function Order({ el, setOrderId }) {
	return (
		<>
			<li onClick={() => setOrderId(el.id)}>
				<label>{el.id}</label>
				<label>{el.public_name}</label>
				<label>{makeDateFormat(el.order_date, "text")}</label>
				<label>{el.shipping_type}</label>
				<label>{`${el.price_sum} Kč`}</label>
			</li>
		</>
	);
}
