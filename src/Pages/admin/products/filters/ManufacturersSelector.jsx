import { useEffect, useState } from "react";
import CheckBox from "../../../Components/basic/checkbox/CheckBox";
import useProductFilterValues from "../../../Hooks/useProductFilterValues";

export default function ManufacturersSelector({ loadedManufacturers }) {
	const { selectedManufacturers } = useProductFilterValues();
	const [manufacturers, setManufacturers] = useState(null);

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!manufacturers) {
			return;
		}
		const selectedIds = manufacturers.filter((manufacturer) => manufacturer.value).map((manufacturer) => manufacturer.id);
		selectedManufacturers.current = selectedIds;
	}, [manufacturers, selectedManufacturers]);

	async function loadData() {
		let manufacturerWithValues = [];
		if (selectedManufacturers.current.length === 0) {
			manufacturerWithValues = await loadedManufacturers.map((manufacturer) => {
				return { ...manufacturer, value: false };
			});
		} else {
			manufacturerWithValues = await loadedManufacturers.map((manufacturer) => {
				if (selectedManufacturers.current.find((item) => item === manufacturer.id)) {
					return { ...manufacturer, value: true };
				}
				return { ...manufacturer, value: false };
			});
		}
		setManufacturers(manufacturerWithValues);
	}

	function onChange(index) {
		const newValue = !manufacturers[index].value;
		setManufacturers((prev) => {
			prev[index].value = newValue;
			return [...prev];
		});
	}

	return (
		<>
			{manufacturers &&
				manufacturers.map((manufacturer, index) => (
					<CheckBox key={manufacturer.name} name={manufacturer.name} checked={manufacturer.value} onChange={() => onChange(index)} />
				))}
		</>
	);
}
