import OrderIdSearchBar from "./filters/OrderIdSearchBar";
import StatusSelector from "./filters/StatusSelector";
import DateSelector from "./filters/DateSelector";
import ShippingSelector from "./filters/ShippingSelector";
import PaymentSelector from "./filters/PaymentSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { filterOrders } from "../../modules/ApiOrders";

import css from "./css/Filter.module.css";
import useOrdersFilterValues from "../../Hooks/useOrdersFilterValues";

export default function Filter({ setOrders, setVisible, shippingTypes }) {
	const { selectedDates, selectedPaymentMethods, selectedShippingTypes, selectedStatusCodes } = useOrdersFilterValues();

	async function loadFilteredData() {
		const filterValues = {
			status: selectedStatusCodes.current,
			order_date: selectedDates.current,
			shipping_type: selectedShippingTypes.current,
			payment_method: selectedPaymentMethods.current,
		};
		const filterData = await filterOrders(filterValues);
		setOrders(filterData);
	}

	async function resetFilter() {
		selectedDates.current = {};
		selectedPaymentMethods.current = [];
		selectedShippingTypes.current = [];
		selectedStatusCodes.current = [];

		const filterData = await filterOrders([]);
		setOrders(filterData);
		setVisible();
	}

	return (
		<motion.div
			className={css.filter}
			initial={{ x: "110%" }}
			animate={{ x: 0 }}
			exit={{ x: "110%" }}
			transition={{ type: "spring", duration: 1.5 }}
			style={{ y: "-50%" }}
		>
			<FontAwesomeIcon
				id={css.close}
				icon={faXmark}
				onClick={() => {
					setVisible(false);
				}}
			/>
			<h2>Objednávkový filtr</h2>

			<h3>Hledat číslo objednávky:</h3>
			<div className={`${css.search_bar} ${css.filter_param}`}>
				<OrderIdSearchBar setOrders={setOrders} />
			</div>

			<h3>Status:</h3>
			<div className={`${css.status_selector} ${css.filter_param}`}>
				<StatusSelector />
			</div>

			<h3>Zobrazit pouze určité období:</h3>
			<div className={`${css.date_selector} ${css.filter_param}`}>
				<DateSelector />
			</div>

			<h3>Druh dopravy:</h3>
			<div className={`${css.shipping_selector} ${css.filter_param}`}>
				<ShippingSelector loadedShippingTypes={shippingTypes} />
			</div>

			<h3>Způsob platby:</h3>
			<div className={`${css.payment_selector} ${css.filter_param}`}>
				<PaymentSelector />
			</div>

			<button onClick={loadFilteredData}>Filtrovat</button>
			<button onClick={resetFilter}>Reset</button>
		</motion.div>
	);
}
