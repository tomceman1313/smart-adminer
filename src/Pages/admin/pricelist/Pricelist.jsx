import { useEffect, useState } from "react";
import { createEventsArray, isActive } from "../../modules/BasicFunctions";
import { AnimatePresence } from "framer-motion";
import { getAll } from "../../modules/ApiFunctions";
import CalendarActionPrices from "./CalendarActionPrices";
import EditPriceItem from "./EditPriceItem";
import NewPriceListItem from "./NewPriceListItem";
import { Helmet } from "react-helmet-async";
import css from "./Pricelist.module.css";
import PlusButton from "../../Components/basic/PlusButton";

export default function Pricelist() {
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
				<title>Ceník | SmartAdminer</title>
			</Helmet>
			<section>
				<h2>Seznam položek ceníku</h2>
				<table className={css.prices_table}>
					<thead>
						<tr>
							<th>Položka</th>
							<th>Cena</th>
							<th>Akční cena</th>
							<th>Aktivní akce</th>
						</tr>
					</thead>
					<tbody>
						{prices &&
							prices.map((item) => (
								<tr key={item.id} onClick={() => setPriceItem(item)}>
									<td>{item.name}</td>
									<td>{item.price} Kč</td>
									<td>{item.special_price !== 0 ? item.special_price : "---"} Kč</td>
									<td>{isActive(item.special_price_start, item.special_price_end, css)}</td>
								</tr>
							))}
					</tbody>
				</table>

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
