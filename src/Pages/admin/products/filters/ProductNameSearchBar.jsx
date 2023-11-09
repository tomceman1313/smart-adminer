import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { getAll } from "../../../modules/ApiFunctions";
import { getByName } from "../../../modules/ApiProducts";
import { useDebounce } from "../../../Hooks/useDebounce";

export default function ProductNameSearchBar({ setProducts }) {
	const [productName, setProductName] = useState("");
	const debounceName = useDebounce(productName);

	useEffect(() => {
		searchProductName(debounceName);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounceName]);

	async function searchProductName(newName) {
		setProductName(newName);

		if (newName === "") {
			const _products = await getAll("products");
			setProducts(_products);
			return;
		}

		const products = await getByName(newName);
		setProducts(products);
	}

	return (
		<>
			<FontAwesomeIcon icon={faMagnifyingGlass} />
			<input value={productName} placeholder="Název produktu" onChange={(e) => setProductName(e.target.value)} />
		</>
	);
}
