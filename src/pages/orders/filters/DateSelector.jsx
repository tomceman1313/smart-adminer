/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { makeDate, makeDateFormat } from "../../../modules/BasicFunctions";
import useOrdersFilterValues from "../../../hooks/useOrdersFilterValues";
import useInteraction from "../../../hooks/useInteraction";
import DatePicker from "../../../components/basic/date-picker-state/DatePicker";
import { useTranslation } from "react-i18next";

export default function DateSelector() {
	const { t } = useTranslation("orders");
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
				setMessage({ action: "alert", text: t("messageInvalidDatesInterval") });
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
			<DatePicker
				value={start}
				onChange={(e) => setStart(e.target.value)}
				placeholder={t("placeholderDateStart")}
				white={true}
				additionalClasses="green half"
			/>
			<DatePicker
				value={end}
				onChange={(e) => setEnd(e.target.value)}
				placeholder={t("placeholderDateEnd")}
				white={true}
				additionalClasses="green half"
			/>
		</>
	);
}
