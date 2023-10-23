import { useContext } from "react";
import ProductsFilterValuesContext from "../context/ProductsFilterValuesContext";

export default function useProductFilterValues() {
	return useContext(ProductsFilterValuesContext);
}
