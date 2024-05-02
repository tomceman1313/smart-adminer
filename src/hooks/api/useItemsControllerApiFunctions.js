import toast from "react-hot-toast";
import { BASE_URL } from "../../modules/ApiFunctions";
import useAuth from "../useAuth";
import useBasicApiFunctions from "./useBasicApiFunctions";

export default function useItemsControllerApiFunctions() {
	const auth = useAuth();
	const { getByCategory, getAll, getByName } = useBasicApiFunctions();
	const bearer = `Bearer ` + auth?.userInfo?.token;

	async function searchByName(apiClass, searchedTerm, selectedCategory) {
		let records;
		if (searchedTerm === "") {
			if (selectedCategory) {
				records = await getByCategory(apiClass, selectedCategory.id);
			} else {
				records = await getAll(apiClass);
			}
			return records;
		}
		records = await getByName(
			apiClass,
			searchedTerm,
			selectedCategory?.id ? selectedCategory.id : null
		);
		return records;
	}

	async function multipleCreate(apiClass, data, positiveText) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/multiple`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				Authorization: bearer,
			},
			body: JSON.stringify({ data: data }),
			credentials: "include",
		});

		if (response.status === 401) {
			auth.setUserInfo(null);
			return null;
		}

		const rdata = await response.json();
		auth.setUserInfo({ ...auth.userInfo, token: rdata.token });
		toast.success(positiveText);
		return;
	}

	async function multipleDelete(apiClass, ids, positiveText) {
		const encodedIds = encodeURIComponent(JSON.stringify(ids));

		const response = await fetch(
			`${BASE_URL}/api/${apiClass}/multiple/${encodedIds}`,
			{
				method: "DELETE",
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

		auth.setUserInfo({ ...auth.userInfo, token: data.token });
		toast.success(positiveText);
		return;
	}

	return {
		searchByName,
		multipleCreate,
		multipleDelete,
	};
}
