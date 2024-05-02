import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getByName } from "../../../modules/ApiProducts";
import { useDebounce } from "../../../hooks/useDebounce";

export default function ProductNameSearchBar({ setProducts }) {
	const [productName, setProductName] = useState("");
	const debounceName = useDebounce(productName);
	const queryClient = useQueryClient();

	useEffect(() => {
		searchProductName(debounceName);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounceName]);

	async function searchProductName(newName) {
		setProductName(newName);

		if (newName === "") {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			return;
		}

		const products = await getByName(newName);
		setProducts(products);
	}

	return (
		<>
			<FontAwesomeIcon icon={faMagnifyingGlass} />
			<input
				value={productName}
				placeholder="Název produktu"
				onChange={(e) => setProductName(e.target.value)}
			/>
		</>
	);
}
