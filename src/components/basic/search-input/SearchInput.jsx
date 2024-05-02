import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import css from "./SearchInput.module.css";

import { useTranslation } from "react-i18next";

export default function SearchInput({ setSearchedName, placeholder }) {
	const { t } = useTranslation("itemsControllerC");
	const [searchTerm, setSearchedTerm] = useState("");
	const debounceSearchTerm = useDebounce(searchTerm, 1000);

	useEffect(() => {
		setSearchedName(debounceSearchTerm);
	}, [debounceSearchTerm, setSearchedName]);

	useEffect(() => {
		setSearchedTerm("");
	}, [placeholder]);

	return (
		<div className={css.search_input}>
			<FontAwesomeIcon icon={faMagnifyingGlass} />
			<input
				value={searchTerm}
				placeholder={placeholder ? placeholder : t("placeholderSearch")}
				onChange={(e) => setSearchedTerm(e.target.value)}
			/>
		</div>
	);
}
