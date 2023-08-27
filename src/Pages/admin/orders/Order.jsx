import React from "react";

export default function Order({ el }) {
	return (
		<li>
			<label>{el.id}</label>
			<label>{el.status_name}</label>
			<label>{el.order_date}</label>
			<label>{el.shipping_type}</label>
			<label>{el.payment_type}</label>
		</li>
	);
}
