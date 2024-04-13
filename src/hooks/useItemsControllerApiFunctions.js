import { BASE_URL } from "../modules/ApiFunctions";
import useAuth from "./useAuth";
import useBasicApiFunctions from "./useBasicApiFunctions";
import useInteraction from "./useInteraction";

export default function useItemsControllerApiFunctions() {
	const auth = useAuth();
	const { getByCategory, getAll, getByName } = useBasicApiFunctions();
	const { setMessage } = useInteraction();
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
		records = await getByName(apiClass, searchedTerm, selectedCategory?.id ? selectedCategory.id : null);
		return records;
	}

	async function multipleCreate(data, positiveText) {
		const response = await fetch(`${BASE_URL}/api/documents/multiple`, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
			body: JSON.stringify({ data: data }),
			credentials: "include",
		});

		if (response.status === 403) {
			auth.setUserInfo(null);
			return null;
		}

		const rdata = await response.json();
		auth.setUserInfo({ ...auth.userInfo, token: rdata.token });
		setMessage({ action: "success", text: positiveText });
		return;
	}

	async function multipleDelete(ids, positiveText) {
		const encodedIds = encodeURIComponent(JSON.stringify(ids));

		const response = await fetch(`${BASE_URL}/api/documents/multiple/${encodedIds}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
			credentials: "include",
		});

		if (response.status === 403) {
			auth.setUserInfo(null);
			return null;
		}

		const data = await response.json();

		auth.setUserInfo({ ...auth.userInfo, token: data.token });
		setMessage({ action: "success", text: positiveText });
		return;
	}

	return {
		searchByName,
		multipleCreate,
		multipleDelete,
	};
}
