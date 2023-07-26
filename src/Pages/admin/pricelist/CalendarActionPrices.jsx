import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // must go before plugins

import css from "./Pricelist.module.css";

export default function CalendarActionPrices({ events, eventHandler }) {
	return (
		<section className={css.calendar}>
			<FullCalendar
				plugins={[dayGridPlugin]}
				events={events}
				locale="cs"
				timeZone="local"
				firstDay="1"
				initialView="dayGridMonth"
				buttonText={{ today: "Dnes" }}
				height="auto"
				eventBorderColor="transparent"
				eventClick={eventHandler}
			></FullCalendar>
		</section>
	);
}
