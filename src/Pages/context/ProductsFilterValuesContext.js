import { createContext, useRef } from "react";

const ProductsFilterValuesContext = createContext(null);

export const ProductsFilterValuesProvider = ({ children }) => {
	const selectedManufacturers = useRef([]);
	const selectedCategories = useRef([]);
	const selectedPriceRange = useRef([]);
	const selectedInStock = useRef([]);

	return (
		<ProductsFilterValuesContext.Provider value={{ selectedManufacturers, selectedCategories, selectedPriceRange, selectedInStock }}>
			{children}
		</ProductsFilterValuesContext.Provider>
	);
};

export default ProductsFilterValuesContext;
