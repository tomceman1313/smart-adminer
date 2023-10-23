import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { getAll } from "../../../modules/ApiFunctions";
import { findById } from "../../../modules/ApiOrders";

export default function ProductNameSearchBar({ setProducts }) {
	const [productName, setProductName] = useState("");

	async function searchProductName(newName) {
		setProductName(newName);

		if (newName === "") {
			const _products = await getAll("products");
			setProducts(_products);
			return;
		}

		const products = await findById(newName);
		setProducts(products);
	}

	return (
		<>
			<FontAwesomeIcon icon={faMagnifyingGlass} />
			<input value={productName} placeholder="Název produktu" onChange={(e) => searchProductName(e.target.value)} />
		</>
	);
}
