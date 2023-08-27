/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Order from "./Order";

import css from "./Orders.module.css";
import OrderIdSearchBar from "./filters/OrderIdSearchBar";
import StatusSelector from "./filters/StatusSelector";
import { filterOrders } from "../../modules/ApiOrders";
import DateSelector from "./filters/DateSelector";
import ShippingSelector from "./filters/ShippingSelector";
import PaymentSelector from "./filters/PaymentSelector";

const DEFAULT_FILTER_VALUES = {
	status: [],
	order_date: {},
	shipping_type: [],
	payment_type: {},
};

export default function Orders() {
	const [orders, setOrders] = useState(null);
	const [filterValues, setFilterValues] = useState(DEFAULT_FILTER_VALUES);

	const [isIdSearchBarVisible, setIsIdSearchBarVisible] = useState(false);
	const [isStatusSelectorVisible, setIsStatusSelectorVisible] = useState(false);
	const [isDateSelectorVisible, setIsDateSelectorVisible] = useState(false);
	const [isShippingSelectorVisible, setIsShippingSelectorVisible] = useState(false);
	const [isPaymentSelectorVisible, setIsPaymentSelectorVisible] = useState(false);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Objednávky";
		document.getElementById("banner-desc").innerHTML = "Přehled obdržených objednávek, možnost jejich vyřízení";
	}, []);

	useEffect(() => {
		loadFilteredData();
	}, [filterValues]);

	async function loadFilteredData() {
		const filterData = await filterOrders(filterValues);
		setOrders(filterData);
	}

	return (
		<div className={css.orders}>
			<section>
				<ul>
					<li className={css.table_head}>
						<AnimatePresence>
							<div key="searchId" className={css.head_column}>
								<p onClick={() => setIsIdSearchBarVisible((prev) => !prev)} style={{ cursor: "pointer" }}>
									Číslo objednávky
								</p>
								{isIdSearchBarVisible && (
									<motion.div className={`${css.search_bar} ${css.filter_param}`}>
										<OrderIdSearchBar setOrders={setOrders} />
									</motion.div>
								)}
							</div>

							<div key="orderStatus" className={css.head_column}>
								<p onClick={() => setIsStatusSelectorVisible((prev) => !prev)} style={{ cursor: "pointer" }}>
									Stav
								</p>
								{isStatusSelectorVisible && (
									<motion.div className={css.status_selector + " " + css.filter_param}>
										<StatusSelector filterValues={filterValues} setFilterValues={setFilterValues} />
									</motion.div>
								)}
							</div>

							<div key="orderDate" className={css.head_column}>
								<p onClick={() => setIsDateSelectorVisible((prev) => !prev)} style={{ cursor: "pointer" }}>
									Datum objednání
								</p>
								{isDateSelectorVisible && (
									<motion.div className={css.date_selector + " " + css.filter_param}>
										<DateSelector filterValues={filterValues} setFilterValues={setFilterValues} />
									</motion.div>
								)}
							</div>

							<div key="shipping" className={css.head_column}>
								<p onClick={() => setIsShippingSelectorVisible((prev) => !prev)} style={{ cursor: "pointer" }}>
									Doprava
								</p>
								{isShippingSelectorVisible && (
									<motion.div className={css.shipping_selector + " " + css.filter_param}>
										<ShippingSelector filterValues={filterValues} setFilterValues={setFilterValues} />
									</motion.div>
								)}
							</div>

							<div key="paymentType" className={css.head_column}>
								<p onClick={() => setIsPaymentSelectorVisible((prev) => !prev)} style={{ cursor: "pointer" }}>
									Způsob platby
								</p>
								{isPaymentSelectorVisible && (
									<motion.div className={css.payment_selector + " " + css.filter_param}>
										<PaymentSelector filterValues={filterValues} setFilterValues={setFilterValues} />
									</motion.div>
								)}
							</div>

							{/* <div className={css.filter}>
								<div className={`${css.status_selector} ${css.filter_param}`}>
									<h3>Status:</h3>
									<StatusSelector filterValues={filterValues} setFilterValues={setFilterValues} />
								</div>

								<div className={`${css.date_selector} ${css.filter_param}`}>
									<h3>Období:</h3>
									<DateSelector filterValues={filterValues} setFilterValues={setFilterValues} />
								</div>

								<div className={`${css.shipping_selector} ${css.filter_param}`}>
									<h3>Doprava:</h3>
									<ShippingSelector filterValues={filterValues} setFilterValues={setFilterValues} />
								</div>

								<div className={`${css.payment_selector} ${css.filter_param}`}>
									<h3>Způsob platby:</h3>
									<PaymentSelector filterValues={filterValues} setFilterValues={setFilterValues} />
								</div>
							</div> */}
						</AnimatePresence>
					</li>

					{orders && orders.length !== 0 ? orders.map((el) => <Order el={el} key={`order-${el.id}`} />) : <p>Nebyly nalezeny žádné objednávky</p>}
				</ul>
			</section>
		</div>
	);
}
