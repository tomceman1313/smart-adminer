import { useState, useEffect } from "react";
import { getShippingTypes } from "../../../modules/ApiOrders";

export default function ShippingSelector({ filterValues, setFilterValues }) {
	const [selectedShippingTypes, setSelectedShippingTypes] = useState({});
	const [shippingTypes, setShippingTypes] = useState(null);

	useEffect(() => {
		loadData();
	}, []);

	useEffect(() => {
		const selectedIds = [];
		for (const [key, value] of Object.entries(selectedShippingTypes)) {
			if (value) {
				const typeId = shippingTypes.find((item) => item.name === key)?.id;
				if (typeId) {
					selectedIds.push(typeId);
				}
			}
		}

		//checks if selectedStatuses are equal as filterStatuses
		const currentShippingTypes = Object.values(filterValues.shipping_type);
		if (currentShippingTypes.toString() === selectedIds.toString()) return;

		setFilterValues((prev) => {
			return { ...prev, shipping_type: selectedIds };
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedShippingTypes]);

	async function loadData() {
		const _shippingTypes = await getShippingTypes();
		setShippingTypes(_shippingTypes);
	}

	return (
		<>
			{shippingTypes &&
				shippingTypes.map((el) => (
					<div key={el.name}>
						<input
							id={el.name}
							type="checkbox"
							value={selectedShippingTypes[el.name]}
							onChange={(e) =>
								setSelectedShippingTypes((prev) => {
									return { ...prev, [el.name]: e.target.checked };
								})
							}
						/>
						<label htmlFor={el.name}>{el.name}</label>
					</div>
				))}
		</>
	);
}
