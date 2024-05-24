import toast from "react-hot-toast";
import { BASE_URL, responseHandler } from "../../modules/ApiFunctions";
import useAuth from "../useAuth";
import i18next from "i18next";

export default function useBasicApiFunctions() {
	const auth = useAuth();
	const bearer = `Bearer ` + auth?.userInfo?.token;

	async function getAll(apiClass, page) {
		const response = await fetch(
			`${BASE_URL}/api/${apiClass}${page ? `/?page=${page}` : ""}`,
			{
				method: "GET",
			}
		);

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

	async function getByName(apiClass, name, categoryId) {
		const categoryParam = `&categoryId=${categoryId}`;
		const response = await fetch(
			`${BASE_URL}/api/${apiClass}/?name=${name}${
				categoryId ? categoryParam : ""
			}`,
			{
				method: "GET",
			}
		);

		const data = await response.json();
		return data;
	}

	async function checkNameAvailability(apiClass, name) {
		const response = await fetch(
			`${BASE_URL}/api/${apiClass}/name/?name=${name}`,
			{
				method: "GET",
			}
		);

		const data = await response.json();
		return data;
	}

	async function getByCategory(apiClass, id, page) {
		const response = await fetch(
			`${BASE_URL}/api/${apiClass}/?${
				page ? `page=${page}&` : ""
			}category=${id}`,
			{
				method: "GET",
			}
		);

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

		if (response.status === 401) {
			auth.setUserInfo(null);
			return null;
		}

		const rdata = await response.json();

		auth.setUserInfo({ ...auth.userInfo, token: rdata.token });
		toast.success(positiveText);
	}

	async function edit(apiClass, data, positiveText) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/${data.id}`, {
			method: "PUT",
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
	}

	async function remove(apiClass, id, positiveText) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				Authorization: bearer,
			},
			credentials: "include",
		});

		await responseHandler(response, auth, positiveText);
	}

	async function updateOrder(apiClass, data, positiveText) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/order`, {
			method: "PUT",
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

	async function deleteImage(apiClass, id, imageId) {
		const response = await fetch(
			`${BASE_URL}/api/${apiClass}/${id}/images/${imageId}`,
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
		toast.success(i18next.t("gallery:positiveTextImageDeleted"));
	}

	async function getAllWithAuth(apiClass) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				Authorization: bearer,
			},
			credentials: "include",
		});

		const data = await response.json();
		auth.setUserInfo({ ...auth.userInfo, token: data.token });
		return data.data;
	}

	async function getWithAuth(apiClass, id) {
		const response = await fetch(`${BASE_URL}/api/${apiClass}/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				Authorization: bearer,
			},
			credentials: "include",
		});

		const data = await response.json();
		auth.setUserInfo({ ...auth.userInfo, token: data.token });
		return data.data;
	}

	return {
		getAll,
		getAllWithAuth,
		get,
		getWithAuth,
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
