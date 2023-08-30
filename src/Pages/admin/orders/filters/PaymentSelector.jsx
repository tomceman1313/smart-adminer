import { useState, useEffect } from "react";
import useOrdersFilterValues from "../../../Hooks/useOrdersFilterValues";

export default function PaymentSelector() {
	const { selectedPaymentMethods } = useOrdersFilterValues();
	const [paymentMethods, setPaymentMethods] = useState([
		{ name: "cash", publicName: "Hotovost", value: false },
		{ name: "card", publicName: "Kartou", value: false },
		{ name: "bank_account", publicName: "Převodem na účet", value: false },
	]);

	useEffect(() => {
		if (selectedPaymentMethods.current.length > 0) {
			setPaymentMethods((prev) => {
				return prev.map((method) => {
					if (selectedPaymentMethods.current.find((item) => item === method.name)) {
						method.value = true;
					}
					return method;
				});
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!paymentMethods) {
			return;
		}
		const selectedNames = paymentMethods.filter((method) => method.value).map((method) => method.name);
		selectedPaymentMethods.current = selectedNames;
	}, [paymentMethods, selectedPaymentMethods]);

	return (
		<>
			{paymentMethods.map((method, index) => (
				<div key={method.name}>
					<input
						id={method.name}
						type="checkbox"
						checked={method.value}
						onChange={(e) =>
							setPaymentMethods((prev) => {
								prev[index].value = e.target.checked;
								return [...prev];
							})
						}
					/>
					<label htmlFor={method.name}>{method.publicName}</label>
				</div>
			))}
		</>
	);
}
