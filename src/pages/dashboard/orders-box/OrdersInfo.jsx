import React from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import css from "./OrdersInfo.module.css";

export default function OrdersInfo({ orders }) {
	return (
		<section className={css.orders}>
			<h4>Objednávky</h4>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					width={0}
					height={0}
					data={orders.monthly_results}
					margin={{
						top: 5,
						right: 0,
						left: 0,
						bottom: 50,
					}}
				>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="month" />
					<YAxis
						label={{
							value: "Počet objednávek",
							angle: -90,
						}}
						allowDecimals={false}
					/>
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						name="Přijaté objednávky"
						dataKey="pending_orders"
						stroke="#2874a6"
						activeDot={{ r: 8 }}
						dot={{ strokeWidth: 4, r: 6 }}
						strokeWidth={3}
					/>
					<Line
						type="monotone"
						name="Dokončené objednávky"
						dataKey="completed_orders"
						stroke="#17a589"
						activeDot={{ r: 8 }}
						dot={{ strokeWidth: 4, r: 6 }}
						strokeWidth={3}
					/>
				</LineChart>
			</ResponsiveContainer>
		</section>
	);
}
