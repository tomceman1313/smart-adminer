import { useEffect, useState } from "react";
import useOrdersFilterValues from "../../../hooks/useOrdersFilterValues";
import { getStatusCodes } from "../../../modules/ApiOrders";
import CheckBox from "../../../components/basic/checkbox/CheckBox";
import { useTranslation } from "react-i18next";

export default function StatusSelector() {
	const { t } = useTranslation("orders");
	const { selectedStatusCodes } = useOrdersFilterValues();
	const [statuses, setStatuses] = useState(null);

	useEffect(() => {
		loadStatusCodes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!statuses) {
			return;
		}
		const selectedIds = statuses?.filter((status) => status.value).map((status) => status.id);
		selectedStatusCodes.current = selectedIds;
	}, [statuses, selectedStatusCodes]);

	async function loadStatusCodes() {
		const _status_codes = await getStatusCodes();

		let statusesWithValues = [];

		if (selectedStatusCodes.current.length === 0) {
			statusesWithValues = await _status_codes.map((status) => {
				return { ...status, value: false };
			});
		} else {
			statusesWithValues = await _status_codes.map((status) => {
				if (selectedStatusCodes.current.find((item) => item === status.id)) {
					return { ...status, value: true };
				}
				return { ...status, value: false };
			});
		}
		setStatuses(statusesWithValues);
	}

	function changeStatuses(index) {
		const newValue = !statuses[index].value;
		setStatuses((prev) => {
			prev[index].value = newValue;
			return [...prev];
		});
	}

	return (
		<>
			{statuses &&
				statuses.map((status, index) => (
					<CheckBox key={status.name} name={t(status.name)} checked={status.value} onChange={() => changeStatuses(index)} />
				))}
		</>
	);
}
