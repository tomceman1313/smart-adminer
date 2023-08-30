/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { makeDate, makeDateFormat } from "../../../modules/BasicFunctions";
import useOrdersFilterValues from "../../../Hooks/useOrdersFilterValues";
import useInteraction from "../../../Hooks/useInteraction";

export default function DateSelector() {
	const { selectedDates } = useOrdersFilterValues();
	const { setMessage } = useInteraction();

	const [start, setStart] = useState("");
	const [end, setEnd] = useState("");

	useEffect(() => {
		if (selectedDates.current.start) {
			setStart(makeDateFormat(selectedDates.current.start, "str"));
		}

		if (selectedDates.current.end) {
			setEnd(makeDateFormat(selectedDates.current.end, "str"));
		}
	}, []);

	useEffect(() => {
		const currentlySelectedDates = {};

		if (start !== "" || end !== "") {
			if (start !== "") {
				currentlySelectedDates.start = makeDateFormat(start);
			} else {
				currentlySelectedDates.start = 20230101;
			}

			if (end !== "") {
				currentlySelectedDates.end = makeDateFormat(end);
			} else {
				const todaysDate = new Date();
				currentlySelectedDates.end = Number(makeDate(todaysDate.getFullYear(), todaysDate.getMonth() + 1, todaysDate.getDate()));
			}

			if (currentlySelectedDates.start > currentlySelectedDates.end) {
				setMessage({ action: "alert", text: "Počáteční datum nemůže být později než konečné!" });
				return;
			}
		}

		if (JSON.stringify(selectedDates.current) === JSON.stringify(currentlySelectedDates)) {
			return;
		}

		selectedDates.current = currentlySelectedDates;
	}, [start, end]);

	return (
		<>
			<input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
			<input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
		</>
	);
}
