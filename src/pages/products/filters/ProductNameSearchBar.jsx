import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDebounce } from "../../../hooks/useDebounce";
import { useTranslation } from "react-i18next";

export default function ProductNameSearchBar() {
	const { t } = useTranslation("products");
	const [productName, setProductName] = useState("");
	const debounceName = useDebounce(productName);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		searchProductName(debounceName);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounceName]);

	async function searchProductName(newName) {
		setProductName(newName);
		if (newName === "" && location.search !== "") {
			navigate("/products");
			return;
		}

		if (newName !== "") {
			navigate(`/products/?name=${newName}`);
		}
	}

	return (
		<>
			<FontAwesomeIcon icon={faMagnifyingGlass} />
			<input
				value={productName}
				placeholder={t("placeholderProductName")}
				onChange={(e) => setProductName(e.target.value)}
			/>
		</>
	);
}
