import { useContext } from "react";
import OrdersFilterValuesContext from "../context/OrdersFilterValuesContext";

export default function useOrdersFilterValues() {
	return useContext(OrdersFilterValuesContext);
}
