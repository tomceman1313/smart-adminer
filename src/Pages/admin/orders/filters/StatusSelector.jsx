import { useEffect, useState } from "react";
import useOrdersFilterValues from "../../../Hooks/useOrdersFilterValues";
import { getStatusCodes } from "../../../modules/ApiOrders";
import CheckBox from "../../../Components/basic/checkbox/CheckBox";

export default function StatusSelector() {
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
					<CheckBox key={status.name} name={status.public_name} checked={status.value} onChange={() => changeStatuses(index)} />
				))}
		</>
	);
}
