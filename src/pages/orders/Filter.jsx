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
import useOrdersFilterValues from "../../hooks/useOrdersFilterValues";
import { useTranslation } from "react-i18next";

export default function Filter({ setOrders, setVisible, shippingTypes }) {
	const { t } = useTranslation("orders");
	const { selectedDates, selectedPaymentMethods, selectedShippingTypes, selectedStatusCodes, searchedId } = useOrdersFilterValues();

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
		searchedId.current = null;

		const filterData = await filterOrders([]);
		setOrders(filterData);
		setVisible();
	}

	return (
		<motion.div className={css.filter} initial={{ x: "110%" }} animate={{ x: 0 }} exit={{ x: "110%" }} transition={{ type: "spring", duration: 1.5 }}>
			<FontAwesomeIcon
				id={css.close}
				icon={faXmark}
				onClick={() => {
					setVisible(false);
				}}
			/>
			<h2>{t("headerFilter")}</h2>
			<div className={css.scrollable}>
				<h3>{t("headerFindByOrderId")}</h3>
				<div className={`${css.search_bar} ${css.filter_param}`}>
					<OrderIdSearchBar setOrders={setOrders} />
				</div>

				<h3>{t("headerDateInterval")}</h3>
				<div className={`${css.date_selector}`}>
					<DateSelector />
				</div>

				<h3>{t("headerStatus")}</h3>
				<div className={`${css.status_selector} ${css.filter_param}`}>
					<StatusSelector />
				</div>

				<h3>{t("headerTransportType")}</h3>
				<div className={`${css.shipping_selector} ${css.filter_param}`}>
					<ShippingSelector loadedShippingTypes={shippingTypes} />
				</div>

				<h3>{t("headerPaymentType")}</h3>
				<div className={`${css.payment_selector} ${css.filter_param}`}>
					<PaymentSelector />
				</div>
			</div>

			<div className={css.buttons_section}>
				<button onClick={loadFilteredData}>{t("buttonFilter")}</button>
				<button onClick={resetFilter}>{t("buttonReset")}</button>
			</div>
		</motion.div>
	);
}
