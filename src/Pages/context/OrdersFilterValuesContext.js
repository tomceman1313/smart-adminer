import { createContext, useRef } from "react";

const OrdersFilterValuesContext = createContext(null);

export const OrdersFilterValuesProvider = ({ children }) => {
	const selectedDates = useRef({});
	const selectedPaymentMethods = useRef([]);
	const selectedShippingTypes = useRef([]);
	const selectedStatusCodes = useRef([]);

	return (
		<OrdersFilterValuesContext.Provider value={{ selectedDates, selectedPaymentMethods, selectedShippingTypes, selectedStatusCodes }}>
			{children}
		</OrdersFilterValuesContext.Provider>
	);
};

export default OrdersFilterValuesContext;
