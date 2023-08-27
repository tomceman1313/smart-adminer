import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { getAll } from "../../../modules/ApiFunctions";
import { findById } from "../../../modules/ApiOrders";

export default function OrderIdSearchBar({ setOrders }) {
	const [searchedId, setSearchedId] = useState("");

	async function searchIdChanged(newId) {
		setSearchedId(newId);

		if (newId === "") {
			const _orders = await getAll("orders");
			setOrders(_orders);
			return;
		}

		const order = await findById(newId);
		setOrders(order);
	}

	return (
		<>
			<FontAwesomeIcon icon={faMagnifyingGlass} />
			<input value={searchedId} placeholder="Číslo objednávky" onChange={(e) => searchIdChanged(e.target.value)} />
		</>
	);
}
