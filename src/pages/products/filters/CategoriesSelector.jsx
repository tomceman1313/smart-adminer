import { useEffect, useState } from "react";
import CheckBox from "../../../components/basic/checkbox/CheckBox";
import useProductFilterValues from "../../../hooks/useProductFilterValues";

export default function CategoriesSelector({ loadedCategories }) {
	const { selectedCategories } = useProductFilterValues();
	const [categories, setCategories] = useState(null);

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!categories) {
			return;
		}
		const selectedIds = categories.filter((category) => category.value).map((category) => category.id);
		selectedCategories.current = selectedIds;
	}, [categories, selectedCategories]);

	async function loadData() {
		let categoriesWithValues = [];
		if (selectedCategories.current.length === 0) {
			categoriesWithValues = await loadedCategories.map((manufacturer) => {
				return { ...manufacturer, value: false };
			});
		} else {
			categoriesWithValues = await loadedCategories.map((manufacturer) => {
				if (selectedCategories.current.find((item) => item === manufacturer.id)) {
					return { ...manufacturer, value: true };
				}
				return { ...manufacturer, value: false };
			});
		}
		setCategories(categoriesWithValues);
	}

	function onChange(index) {
		const newValue = !categories[index].value;
		setCategories((prev) => {
			prev[index].value = newValue;
			return [...prev];
		});
	}

	return (
		<>
			{categories &&
				categories.map((category, index) => (
					<CheckBox key={category.name} name={category.name} checked={category.value} onChange={() => onChange(index)} />
				))}
		</>
	);
}
