import { BASE_URL } from "../modules/ApiFunctions";
import useAuth from "./useAuth";
import useInteraction from "./useInteraction";

export default function useApiCategories() {
	const auth = useAuth();
	const { setMessage } = useInteraction();
	const bearer = `Bearer ` + auth?.userInfo?.token;

	async function getCategories(apiClass) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/categories`, {
			method: "GET",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			credentials: "include",
		});

		if (response.status === 403) {
			return null;
		}

		const data = await response.json();
		return data;
	}

	async function createCategory(apiClass, data, positiveText) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/categories`, {
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
	}

	async function updateCategory(apiClass, data, positiveText) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/categories/${data.id}`, {
			method: "PUT",
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
	}

	async function deleteCategory(apiClass, id, positiveText) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/categories/${id}`, {
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
	}

	return { getCategories, createCategory, updateCategory, deleteCategory };
}
