import { useEffect, useState } from "react";
import useOrdersFilterValues from "../../../hooks/useOrdersFilterValues";
import CheckBox from "../../../components/basic/checkbox/CheckBox";

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

	function onChange(index) {
		const newValue = !shippingTypes[index].value;
		setShippingTypes((prev) => {
			prev[index].value = newValue;
			return [...prev];
		});
	}

	return (
		<>
			{shippingTypes &&
				shippingTypes.map((shippingType, index) => (
					<CheckBox key={shippingType.name} name={shippingType.name} checked={shippingType.value} onChange={() => onChange(index)} />
				))}
		</>
	);
}
