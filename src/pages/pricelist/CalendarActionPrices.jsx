import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // must go before plugins

import css from "./Pricelist.module.css";
import { useTranslation } from "react-i18next";

export default function CalendarActionPrices({ events, eventHandler }) {
	const { i18n, t } = useTranslation("priceList");

	return (
		<section className={css.calendar}>
			<FullCalendar
				plugins={[dayGridPlugin]}
				events={events}
				locale={i18n.language}
				timeZone="local"
				firstDay="1"
				initialView="dayGridMonth"
				buttonText={{ today: t("today") }}
				height="auto"
				eventBorderColor="transparent"
				eventClick={eventHandler}
			></FullCalendar>
		</section>
	);
}
