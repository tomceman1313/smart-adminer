import { BASE_URL } from "../../modules/ApiFunctions";
import useAuth from "../useAuth";

export default function useStatsApi() {
	const auth = useAuth();
	const bearer = `Bearer ` + auth?.userInfo?.token;

	async function getStats(sections) {
		const encodedSectionsName = encodeURIComponent(JSON.stringify(sections));

		const response = await fetch(
			`${BASE_URL}/api/stats/?sections=${encodedSectionsName}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
					Authorization: bearer,
				},
				credentials: "include",
			}
		);

		if (response.status === 401) {
			auth.setUserInfo(null);
			return null;
		}

		const data = await response.json();

		//auth.setUserInfo({ ...auth.userInfo, token: data.token });
		return data.data;
	}

	return {
		getStats,
	};
}
