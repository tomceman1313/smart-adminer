/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { filterOrders, getShippingTypes } from "../../modules/ApiOrders";
import Order from "./Order";
import OrderDetail from "./OrderDetail";

import Filter from "./Filter";
import css from "./Orders.module.css";

const DEFAULT_FILTER_VALUES = {
	status: [],
	order_date: {},
	shipping_type: [],
	payment_type: {},
};

export default function Orders() {
	const [orders, setOrders] = useState(null);
	const [filterValues, setFilterValues] = useState(DEFAULT_FILTER_VALUES);
	const [isFilterVisible, setIsFilterVisible] = useState(null);

	const [orderId, setOrderId] = useState(null);
	const [shippingTypes, setShippingTypes] = useState(null);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Objednávky";
		document.getElementById("banner-desc").innerHTML = "Přehled obdržených objednávek, možnost jejich vyřízení";
		loadData();
	}, []);

	useEffect(() => {
		loadFilteredData();
	}, [filterValues]);

	async function loadFilteredData() {
		const filterData = await filterOrders(filterValues);
		setOrders(filterData);
	}

	async function loadData() {
		const _shipping_types = await getShippingTypes();
		setShippingTypes(_shipping_types);
	}

	return (
		<div className={css.orders}>
			<section>
				<ul className={css.orders_list}>
					<li className={css.table_head} onClick={() => setIsFilterVisible(true)}>
						<AnimatePresence>
							<div key="searchId" className={css.head_column}>
								<p style={{ cursor: "pointer" }}>Číslo objednávky</p>
							</div>

							<div key="orderStatus" className={css.head_column}>
								<p style={{ cursor: "pointer" }}>Stav</p>
							</div>

							<div key="orderDate" className={css.head_column}>
								<p style={{ cursor: "pointer" }}>Datum objednání</p>
							</div>

							<div key="shipping" className={css.head_column}>
								<p style={{ cursor: "pointer" }}>Doprava</p>
							</div>

							<div key="paymentType" className={css.head_column}>
								<p style={{ cursor: "pointer" }}>Způsob platby</p>
							</div>
						</AnimatePresence>
					</li>

					{orders && orders.length !== 0 ? (
						orders.map((el) => <Order el={el} key={`order-${el.id}`} setOrderId={setOrderId} />)
					) : (
						<p>Nebyly nalezeny žádné objednávky</p>
					)}
				</ul>
			</section>
			<AnimatePresence>
				{orderId && <OrderDetail id={orderId} setVisible={setOrderId} shippingTypes={shippingTypes} reloadData={loadData} />}
			</AnimatePresence>

			<AnimatePresence>
				{isFilterVisible && (
					<Filter filterValues={filterValues} setFilterValues={setFilterValues} setOrders={setOrders} setVisible={setIsFilterVisible} />
				)}
			</AnimatePresence>
		</div>
	);
}
