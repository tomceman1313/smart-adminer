/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { makeDate, makeDateFormat } from "../../../modules/BasicFunctions";

export default function DateSelector({ filterValues, setFilterValues }) {
	const [start, setStart] = useState("");
	const [end, setEnd] = useState("");

	useEffect(() => {
		const selectedDates = {};

		if (start !== "" || end !== "") {
			if (start !== "") {
				selectedDates.start = makeDateFormat(start);
			} else {
				selectedDates.start = 20230101;
			}

			if (end !== "") {
				selectedDates.end = makeDateFormat(end);
			} else {
				const todaysDate = new Date();
				selectedDates.end = Number(makeDate(todaysDate.getFullYear(), todaysDate.getMonth() + 1, todaysDate.getDate()));
			}
		}

		if (JSON.stringify(filterValues.order_date) === JSON.stringify(selectedDates)) {
			return;
		}

		setFilterValues((prev) => {
			return { ...prev, order_date: selectedDates };
		});
	}, [start, end]);

	return (
		<>
			<input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
			<input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
		</>
	);
}
