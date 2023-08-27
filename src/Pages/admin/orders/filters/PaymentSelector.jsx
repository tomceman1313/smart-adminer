import { useState, useEffect } from "react";

export default function PaymentSelector({ filterValues, setFilterValues }) {
	const [selectedPaymentTypes, setSelectedPaymentTypes] = useState({});
	const [shippingTypes] = useState([
		{ value: "cash", name: "Hotovost" },
		{ value: "card", name: "Kartou" },
		{ value: "bank_account", name: "Převodem na účet" },
	]);

	useEffect(() => {
		const selectedIds = [];

		for (const [key, value] of Object.entries(selectedPaymentTypes)) {
			if (value) {
				selectedIds.push(key);
			}
		}

		if (Object.values(filterValues.payment_type).toString() === selectedIds.toString()) return;

		setFilterValues((prev) => {
			return { ...prev, payment_type: selectedIds };
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedPaymentTypes]);

	return (
		<>
			{shippingTypes.map((type) => (
				<div key={type.value}>
					<input
						id={type.value}
						type="checkbox"
						value={selectedPaymentTypes[type.value]}
						onChange={(e) =>
							setSelectedPaymentTypes((prev) => {
								return { ...prev, [type.value]: e.target.checked };
							})
						}
					/>
					<label htmlFor={type.value}>{type.name}</label>
				</div>
			))}
		</>
	);
}
