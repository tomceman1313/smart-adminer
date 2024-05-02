import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PlusButton from "../../components/basic/PlusButton";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import { createEventsArray, isActive } from "../../modules/BasicFunctions";
import CalendarActionPrices from "./CalendarActionPrices";
import EditPriceItem from "./EditPriceItem";
import NewPriceListItem from "./NewPriceListItem";
import css from "./Pricelist.module.css";

export default function Pricelist() {
	const { t } = useTranslation("priceList");
	const { getAll } = useBasicApiFunctions();

	const [events, setEvents] = useState([]);

	const [priceItem, setPriceItem] = useState(false);
	const [showAddItemCont, setShowAddItemCont] = useState(false);

	const { data: prices, refetch } = useQuery({
		queryKey: ["priceList"],
		queryFn: async () => {
			const data = await getAll("pricelist");
			setEvents(createEventsArray(data));
			return data;
		},
		meta: {
			errorMessage: t("errorFetchPages"),
		},
	});

	function eventHandler(info) {
		window.scrollTo(0, 0);
		const pickedPriceItem = prices.find(
			(item) => item.id === Number(info.event.id)
		);
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
									<td>
										{t("tableRowPrice", {
											price:
												item.special_price !== 0 ? item.special_price : "---",
										})}
									</td>
									<td>
										{isActive(
											item.special_price_start,
											item.special_price_end,
											css
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>{t("noDataFound")}</p>
				)}

				<AnimatePresence>
					{showAddItemCont && (
						<NewPriceListItem
							loadData={refetch}
							close={() => setShowAddItemCont(false)}
						/>
					)}
					{priceItem && (
						<EditPriceItem
							priceItem={priceItem}
							setPriceItem={setPriceItem}
							loadData={refetch}
						/>
					)}
				</AnimatePresence>
			</section>
			<CalendarActionPrices events={events} eventHandler={eventHandler} />
			<PlusButton onClick={() => setShowAddItemCont(true)} />
		</div>
	);
}
