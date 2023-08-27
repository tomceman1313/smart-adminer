import { useEffect, useState } from "react";

export default function StatusSelector({ filterValues, setFilterValues }) {
	const [selectedStatuses, setSelectedStatuses] = useState({ pending: false, shipped: false, completed: false, cancelled: false });
	const [statuses] = useState([
		{ id: 1, value: "pending", name: "Přijata" },
		{ id: 2, value: "shipped", name: "Odeslána" },
		{ id: 3, value: "completed", name: "Dokončena" },
		{ id: 4, value: "cancelled", name: "Zrušena" },
	]);

	useEffect(() => {
		const selectedIds = [];

		for (const [key, value] of Object.entries(selectedStatuses)) {
			if (value) {
				const statusId = statuses.find((item) => item.value === key)?.id;
				selectedIds.push(statusId);
			}
		}

		if (Object.values(filterValues.status).toString() === selectedIds.toString()) return;

		setFilterValues((prev) => {
			return { ...prev, status: selectedIds };
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedStatuses]);

	return (
		<>
			{statuses.map((status) => (
				<div key={status.name}>
					<input
						id={status.value}
						type="checkbox"
						value={selectedStatuses[status.value]}
						onChange={(e) =>
							setSelectedStatuses((prev) => {
								return { ...prev, [status.value]: e.target.checked };
							})
						}
					/>
					<label htmlFor={status.name}>{status.name}</label>
				</div>
			))}
		</>
	);
}
