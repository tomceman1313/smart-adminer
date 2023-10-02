/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { filterOrders, getShippingTypes } from "../../modules/ApiOrders";
import Order from "./Order";
import OrderDetail from "./OrderDetail";

import Filter from "./Filter";
import css from "./Orders.module.css";
import { OrdersFilterValuesProvider } from "../../context/OrdersFilterValuesContext";

export default function Orders() {
	const [orders, setOrders] = useState(null);
	const [isFilterVisible, setIsFilterVisible] = useState(null);

	const [orderId, setOrderId] = useState(null);
	const [shippingTypes, setShippingTypes] = useState(null);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Objednávky";
		document.getElementById("banner-desc").innerHTML = "Přehled obdržených objednávek, možnost jejich vyřízení";
		loadData();
	}, []);

	async function loadData() {
		const _orders = await filterOrders([]);
		setOrders(_orders);
		console.log(_orders);
		const _shipping_types = await getShippingTypes();
		setShippingTypes(_shipping_types);
	}

	return (
		<div className={css.orders}>
			<section>
				<ul className={css.orders_list}>
					<li className={css.table_head} onClick={() => setIsFilterVisible(true)}>
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
							<p style={{ cursor: "pointer" }}>Celková cena</p>
						</div>
					</li>

					{orders && orders.length !== 0 ? (
						orders.map((el) => <Order el={el} key={`order-${el.id}`} setOrderId={setOrderId} />)
					) : (
						<p>Nebyly nalezeny žádné objednávky</p>
					)}
				</ul>
			</section>

			<OrdersFilterValuesProvider>
				<AnimatePresence>
					{orderId && <OrderDetail key="orderDetail" id={orderId} setVisible={setOrderId} shippingTypes={shippingTypes} reloadData={loadData} />}
					{isFilterVisible && <Filter key="filter" setOrders={setOrders} setVisible={setIsFilterVisible} shippingTypes={shippingTypes} />}
				</AnimatePresence>
			</OrdersFilterValuesProvider>
		</div>
	);
}
