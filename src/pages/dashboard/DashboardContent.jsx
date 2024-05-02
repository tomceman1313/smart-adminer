import { useQuery } from "@tanstack/react-query";
import BoxesRow from "./info-boxes/BoxesRow";
import OrdersInfo from "./orders-box/OrdersInfo";
import useStatsApi from "../../hooks/api/useStatsApi";
import { getMonthName } from "../../modules/BasicFunctions";

export default function DashboardContent() {
	const { getStats } = useStatsApi();

	const { data: stats } = useQuery({
		queryKey: ["stats"],
		queryFn: async () => {
			let data = await getStats([
				"articles",
				"employees",
				"documents",
				"gallery",
				"orders",
			]);

			if (data?.orders) {
				data.orders.monthly_results = data.orders.monthly_results.map(
					(item) => {
						return { ...item, month: getMonthName(item.month, "cs") };
					}
				);
			}
			console.log(data);
			return data;
		},
	});

	return (
		<>
			<BoxesRow stats={stats} />
			{stats?.orders && <OrdersInfo orders={stats.orders} />}
		</>
	);
}
