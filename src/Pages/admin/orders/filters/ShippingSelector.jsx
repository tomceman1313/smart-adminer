import { useEffect, useState } from "react";
import useOrdersFilterValues from "../../../Hooks/useOrdersFilterValues";

export default function ShippingSelector({ loadedShippingTypes }) {
	const { selectedShippingTypes } = useOrdersFilterValues();
	const [shippingTypes, setShippingTypes] = useState(null);

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!shippingTypes) {
			return;
		}
		const selectedIds = shippingTypes.filter((shippingType) => shippingType.value).map((shippingType) => shippingType.id);
		selectedShippingTypes.current = selectedIds;
	}, [shippingTypes, selectedShippingTypes]);

	async function loadData() {
		let shippingTypesWithValues = [];
		if (selectedShippingTypes.current.length === 0) {
			shippingTypesWithValues = await loadedShippingTypes.map((shippingType) => {
				return { ...shippingType, value: false };
			});
		} else {
			shippingTypesWithValues = await loadedShippingTypes.map((shippingType) => {
				if (selectedShippingTypes.current.find((item) => item === shippingType.id)) {
					return { ...shippingType, value: true };
				}
				return { ...shippingType, value: false };
			});
		}
		setShippingTypes(shippingTypesWithValues);
	}

	return (
		<>
			{shippingTypes &&
				shippingTypes.map((shippingType, index) => (
					<div key={shippingType.name}>
						<input
							id={shippingType.name}
							type="checkbox"
							checked={shippingType.value}
							onChange={(e) =>
								setShippingTypes((prev) => {
									prev[index].value = e.target.checked;
									return [...prev];
								})
							}
						/>
						<label htmlFor={shippingType.name}>{shippingType.name}</label>
					</div>
				))}
		</>
	);
}
