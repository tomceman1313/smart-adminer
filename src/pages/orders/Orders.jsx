/* eslint-disable react-hooks/exhaustive-deps */
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
	filterOrders,
	getShippingTypes,
	getStatusCodes,
} from "../../modules/ApiOrders";
import Order from "./Order";
import OrderDetail from "./OrderDetail";
import { Helmet } from "react-helmet-async";
import Filter from "./Filter";
import css from "./Orders.module.css";
import { OrdersFilterValuesProvider } from "../../context/OrdersFilterValuesContext";
import { useTranslation } from "react-i18next";
import NoDataFound from "../../components/loaders/NoDataFound/NoDataFound";

export default function Orders() {
	const { t } = useTranslation("orders");
	const [orders, setOrders] = useState(null);
	const [isFilterVisible, setIsFilterVisible] = useState(null);

	const [orderId, setOrderId] = useState(null);
	const [shippingTypes, setShippingTypes] = useState(null);
	const [statusCodes, setStatusCodes] = useState(null);

	useEffect(() => {
		loadData();
	}, []);

	async function loadData() {
		const _orders = await filterOrders([]);
		setOrders(_orders);
		const _shipping_types = await getShippingTypes();
		setShippingTypes(_shipping_types);
		const _status_codes = await getStatusCodes();
		setStatusCodes(_status_codes);
	}

	return (
		<div className={css.orders}>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<section>
				<ul className={css.orders_list}>
					<li
						className={css.table_head}
						onClick={() => setIsFilterVisible(true)}
					>
						<div key="searchId" className={css.head_column}>
							<p style={{ cursor: "pointer" }}>{t("tableHeadOrderNumber")}</p>
						</div>

						<div key="orderStatus" className={css.head_column}>
							<p style={{ cursor: "pointer" }}>{t("tableHeadState")}</p>
						</div>

						<div key="orderDate" className={css.head_column}>
							<p style={{ cursor: "pointer" }}>{t("tableHeadOrderDate")}</p>
						</div>

						<div key="shipping" className={css.head_column}>
							<p style={{ cursor: "pointer" }}>{t("tableHeadTransportType")}</p>
						</div>

						<div key="paymentType" className={css.head_column}>
							<p style={{ cursor: "pointer" }}>{t("tableHeadPrice")}</p>
						</div>
					</li>

					{orders?.length > 0 ? (
						orders.map((el) => (
							<Order el={el} key={`order-${el.id}`} setOrderId={setOrderId} />
						))
					) : (
						<NoDataFound text={t("noDataFound")} />
					)}
				</ul>
			</section>

			<OrdersFilterValuesProvider>
				<AnimatePresence>
					{orderId && (
						<OrderDetail
							key="orderDetail"
							id={orderId}
							setVisible={setOrderId}
							shippingTypes={shippingTypes}
							statusCodes={statusCodes}
							reloadData={loadData}
						/>
					)}
					{isFilterVisible && (
						<Filter
							key="filter"
							setOrders={setOrders}
							setVisible={setIsFilterVisible}
							shippingTypes={shippingTypes}
						/>
					)}
				</AnimatePresence>
			</OrdersFilterValuesProvider>
		</div>
	);
}
