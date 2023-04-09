import { BASE_URL } from "./ApiFunctions";

export async function getCategories(setState, apiClass) {
	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=getCategories`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		credentials: "include",
	});

	if (response.status === 403) {
		return null;
	}

	const data = await response.json();
	setState(data.data);
	return data;
}

export async function createCategory(data, auth, setMessage, apiClass) {
	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=createCategory`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ data: data, token: auth.userInfo.token }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const rdata = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: rdata.token });
	setMessage({ action: "success", text: "Kategorie byla přidána" });
}

export async function updateCategory(data, auth, setMessage, apiClass) {
	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=updateCategory`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ data: data, token: auth.userInfo.token }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const rdata = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: rdata.token });
	setMessage({ action: "success", text: "Kategorie byla upravena" });
}

export async function deleteCategory(id, auth, setMessage, apiClass) {
	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=deleteCategory`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ id: id, token: auth.userInfo.token }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const data = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	setMessage({ action: "success", text: "Kategorie byla smazána" });
}

export async function getByCategory(id, setImages, auth) {
	const response = await fetch(`${BASE_URL}/api/?class=gallery&action=getByCategory`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ category_id: id, token: auth.userInfo.token }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const data = await response.json();

	setImages(data.data);
	return data;
}
