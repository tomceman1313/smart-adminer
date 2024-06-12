import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import cssBasic from "../../styles/Basic.module.css";
import css from "./CategorySelector.module.css";
export default function CategorySelector({
	categories,
	selectedCategories,
	setSelectedCategories,
	placeholder,
}) {
	const [value, setValue] = useState("default");

	function chooseCategory(e) {
		const name = categories.filter(
			(item) => item.id === parseInt(e.target.value)
		);
		const alreadyIn = selectedCategories.find(
			(item) => item.id === parseInt(e.target.value)
		);
		setValue("default");
		if (alreadyIn) {
			return;
		}

		if (name.length !== 0) {
			setSelectedCategories((prev) => [...prev, name[0]]);
		}
	}

	function removeFromPicked(e) {
		const removed = selectedCategories.filter(
			(item) => item.id !== parseInt(e.target.id)
		);
		setSelectedCategories(removed);
	}

	return (
		<>
			<div className={`${cssBasic.input_box} ${css.select}`}>
				<select value={value} onChange={chooseCategory}>
					<option value="default" disabled>
						{placeholder}
					</option>
					{categories &&
						categories.map((el) => (
							<option key={`${el.name}-${el.id}`} value={el.id}>
								{el.name}
							</option>
						))}
				</select>
				<FontAwesomeIcon className={cssBasic.icon} icon={faHashtag} />
			</div>

			<ul className={css.picked_categories}>
				{selectedCategories &&
					selectedCategories.map((el) => (
						<li key={`selected-${el.id}`} id={el.id} onClick={removeFromPicked}>
							{el.name}
						</li>
					))}
			</ul>
		</>
	);
}
