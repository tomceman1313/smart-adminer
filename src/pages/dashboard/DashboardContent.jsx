import { useQuery } from "@tanstack/react-query";
import BoxesRow from "./info-boxes/BoxesRow";
import OrdersInfo from "./orders-box/OrdersInfo";
import useStatsApi from "../../hooks/api/useStatsApi";

export default function DashboardContent() {
	const { getStats } = useStatsApi();

	const { data: stats } = useQuery({
		queryKey: ["stats"],
		queryFn: async () => {
			const data = await getStats([
				"articles",
				"employees",
				"documents",
				"gallery",
				"orders",
			]);

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
