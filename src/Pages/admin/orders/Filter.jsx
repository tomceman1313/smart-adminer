import React from "react";
import OrderIdSearchBar from "./filters/OrderIdSearchBar";
import StatusSelector from "./filters/StatusSelector";
import DateSelector from "./filters/DateSelector";
import ShippingSelector from "./filters/ShippingSelector";
import PaymentSelector from "./filters/PaymentSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

import css from "./css/Filter.module.css";

export default function Filter({ filterValues, setFilterValues, setOrders, setVisible }) {
	return (
		<motion.div
			className={css.filter}
			initial={{ x: "100%", y: "-50%" }}
			animate={{ x: 0, y: "-50%" }}
			exit={{ x: "100%", y: "-50%" }}
			transition={{ type: "spring", duration: 1 }}
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
				<StatusSelector filterValues={filterValues} setFilterValues={setFilterValues} />
			</div>

			<h3>Zobrazit pouze určité období:</h3>
			<div className={`${css.date_selector} ${css.filter_param}`}>
				<DateSelector filterValues={filterValues} setFilterValues={setFilterValues} />
			</div>

			<h3>Druh dopravy:</h3>
			<div className={`${css.shipping_selector} ${css.filter_param}`}>
				<ShippingSelector filterValues={filterValues} setFilterValues={setFilterValues} />
			</div>

			<h3>Způsob platby:</h3>
			<div className={`${css.payment_selector} ${css.filter_param}`}>
				<PaymentSelector filterValues={filterValues} setFilterValues={setFilterValues} />
			</div>
		</motion.div>
	);
}
