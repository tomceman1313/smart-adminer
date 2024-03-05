import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { filterOrders } from "../../../modules/ApiOrders";
import { findById } from "../../../modules/ApiOrders";
import { useDebounce } from "../../../Hooks/useDebounce";
import useOrdersFilterValues from "../../../Hooks/useOrdersFilterValues";

export default function OrderIdSearchBar({ setOrders }) {
	const { searchedId } = useOrdersFilterValues();
	const [searchId, setSearchedId] = useState(searchedId.current ? searchedId.current : "");
	const debounceId = useDebounce(searchId);

	useEffect(() => {
		if (!searchedId.current && searchId === "") {
			return;
		}
		searchIdChanged(debounceId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounceId]);

	async function searchIdChanged(newId) {
		if (newId === "") {
			const _orders = await filterOrders([]);
			setOrders(_orders);
			return;
		}
		searchedId.current = newId;
		const order = await findById(newId);
		//console.log(order);
		setOrders(order);
	}

	return (
		<>
			<FontAwesomeIcon icon={faMagnifyingGlass} />
			<input value={searchId} placeholder="Číslo objednávky" onChange={(e) => setSearchedId(e.target.value)} />
		</>
	);
}
