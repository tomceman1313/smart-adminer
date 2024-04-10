import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import { getByCategory, getByName, getAll } from "../../../modules/ApiFunctions";
import css from "./SearchInput.module.css";

export default function SearchInput({ apiClass, selectedCategory, setState, placeholder }) {
	const [searchTerm, setSearchedId] = useState("");
	const debounceSearchTerm = useDebounce(searchTerm, 1000);

	useEffect(() => {
		findRecords(debounceSearchTerm);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounceSearchTerm]);

	async function findRecords(searchedTerm) {
		let records;
		if (searchedTerm === "") {
			if (selectedCategory) {
				records = await getByCategory(apiClass, selectedCategory.id);
			} else {
				records = await getAll(apiClass);
			}
			setState(records);
			return;
		}
		records = await getByName(apiClass, searchedTerm, selectedCategory?.id ? selectedCategory.id : null);
		setState(records);
	}

	return (
		<div className={css.search_input}>
			<FontAwesomeIcon icon={faMagnifyingGlass} />
			<input value={searchTerm} placeholder={placeholder ? placeholder : "Hledat"} onChange={(e) => setSearchedId(e.target.value)} />
		</div>
	);
}
