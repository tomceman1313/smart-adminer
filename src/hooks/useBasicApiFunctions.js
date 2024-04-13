import { BASE_URL } from "../modules/ApiFunctions";
import useAuth from "./useAuth";
import useInteraction from "./useInteraction";

export default function useBasicApiFunctions() {
	const auth = useAuth();
	const { setMessage } = useInteraction();
	const bearer = `Bearer ` + auth?.userInfo?.token;

	async function getAll(apiClass, page) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}${page ? `/?page=${page}` : ""}`, {
			method: "GET",
		});

		const data = await response.json();

		return data;
	}

	async function get(apiClass, id) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/${id}`, {
			method: "GET",
		});

		const data = await response.json();
		return data;
	}

	/**
	 *
	 * @param {string} apiClass
	 * @param {string} name
	 * @param {string} category - optional for getting only records of given category
	 * @returns object[]
	 */
	async function getByName(apiClass, name, categoryId) {
		const categoryParam = `&categoryId=${categoryId}`;
		const response = await fetch(`${BASE_URL}/api/${apiClass}/?name=${name}${categoryId ? categoryParam : ""}`, {
			method: "GET",
		});

		const data = await response.json();
		return data;
	}

	async function checkNameAvailability(apiClass, name) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/name/?name=${name}`, {
			method: "GET",
		});

		const data = await response.json();
		return data;
	}

	async function getByCategory(apiClass, id) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/?category=${id}`, {
			method: "GET",
		});

		const data = await response.json();
		return data;
	}

	async function create(apiClass, data, positiveText) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}`, {
			method: "POST",
			headers: {
				Authorization: bearer,
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			},
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

	async function edit(apiClass, data, positiveText) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/${data.id}`, {
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

	async function remove(apiClass, id, positiveText) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/${id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
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

	async function updateOrder(apiClass, data, positiveText) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/order`, {
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
		return;
	}

	async function deleteImage(apiClass, id, imageId) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/${id}/images/${imageId}`, {
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
		if (response.status === 200) {
			setMessage({ action: "success", text: "Obrázek byl smazán" });
		} else {
			setMessage({ action: "failure", text: "Smazání položky nebylo provedeno", timeout: 6000 });
		}
	}

	return {
		getAll,
		get,
		getByName,
		getByCategory,
		create,
		edit,
		remove,
		updateOrder,
		deleteImage,
		checkNameAvailability,
	};
}
