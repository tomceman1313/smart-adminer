import { useEffect, useState } from "react";
import useOrdersFilterValues from "../../../Hooks/useOrdersFilterValues";
import { getStatusCodes } from "../../../modules/ApiOrders";

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

	return (
		<>
			{statuses &&
				statuses.map((status, index) => (
					<div key={status.name}>
						<input
							id={status.name}
							type="checkbox"
							checked={status.value}
							onChange={(e) =>
								setStatuses((prev) => {
									prev[index].value = e.target.checked;
									return [...prev];
								})
							}
						/>
						<label htmlFor={status.name}>{status.public_name}</label>
					</div>
				))}
		</>
	);
}
