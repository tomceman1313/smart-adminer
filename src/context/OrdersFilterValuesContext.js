import { createContext, useRef } from "react";

const OrdersFilterValuesContext = createContext(null);

export const OrdersFilterValuesProvider = ({ children }) => {
	const selectedDates = useRef({});
	const selectedPaymentMethods = useRef([]);
	const selectedShippingTypes = useRef([]);
	const selectedStatusCodes = useRef([]);
	const searchedId = useRef(null);

	return (
		<OrdersFilterValuesContext.Provider value={{ selectedDates, selectedPaymentMethods, selectedShippingTypes, selectedStatusCodes, searchedId }}>
			{children}
		</OrdersFilterValuesContext.Provider>
	);
};

export default OrdersFilterValuesContext;
