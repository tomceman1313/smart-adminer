import { useEffect, useState } from "react";
import { createEventsArray, isActive } from "../../modules/BasicFunctions";
import { AnimatePresence } from "framer-motion";
import { getAll } from "../../modules/ApiFunctions";
import CalendarActionPrices from "./CalendarActionPrices";
import EditPriceItem from "./EditPriceItem";
import NewPriceListItem from "./NewPriceListItem";
import { Helmet } from "react-helmet-async";
import css from "./Pricelist.module.css";
import PlusButton from "../../components/basic/PlusButton";
import { useTranslation } from "react-i18next";

export default function Pricelist() {
	const { t } = useTranslation("priceList");

	const [prices, setPrices] = useState(null);
	const [events, setEvents] = useState([]);

	const [priceItem, setPriceItem] = useState(false);
	const [showAddItemCont, setShowAddItemCont] = useState(false);

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function loadData() {
		const data = await getAll("pricelist");
		setPrices(data);
		setEvents(createEventsArray(data));
	}

	/**
	 * * Handler pro onclick eventu
	 * @param {object} info: objekt obsahující veškerá data eventu
	 */
	function eventHandler(info) {
		window.scrollTo(0, 0);
		const pickedPriceItem = prices.find((item) => item.id === Number(info.event.id));
		setPriceItem(pickedPriceItem);
	}

	return (
		<div className={css.pricelist}>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<section>
				<h2>{t("headerPriceList")}</h2>
				{prices?.length > 0 ? (
					<table className={css.prices_table}>
						<thead>
							<tr>
								<th>{t("tableHeadItem")}</th>
								<th>{t("tableHeadPrice")}</th>
								<th>{t("tableHeadSpecialPrice")}</th>
								<th>{t("tableHeadActiveSpecialPrice")}</th>
							</tr>
						</thead>
						<tbody>
							{prices.map((item) => (
								<tr key={item.id} onClick={() => setPriceItem(item)}>
									<td>{item.name}</td>
									<td>{t("tableRowPrice", { price: item.price })}</td>
									<td>{t("tableRowPrice", { price: item.special_price !== 0 ? item.special_price : "---" })}</td>
									<td>{isActive(item.special_price_start, item.special_price_end, css)}</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>{t("noDataFound")}</p>
				)}

				<AnimatePresence>
					{showAddItemCont && <NewPriceListItem loadData={loadData} close={() => setShowAddItemCont(false)} />}
					{priceItem && <EditPriceItem priceItem={priceItem} setPriceItem={setPriceItem} loadData={loadData} />}
				</AnimatePresence>
			</section>
			<CalendarActionPrices events={events} eventHandler={eventHandler} />
			<PlusButton onClick={() => setShowAddItemCont(true)} />
		</div>
	);
}
