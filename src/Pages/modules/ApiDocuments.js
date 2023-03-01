import { BASE_URL } from "./ApiFunctions";
//const BASE_URL = "http://localhost:4300";

export async function getCategories(auth, setState) {
	const response = await fetch(`${BASE_URL}/api/?class=documents&action=getCategories`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ token: auth.userInfo.token }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const data = await response.json();
	setState(data.data);
	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	return data;
}

export async function createCategory(data, auth, setMessage) {
	const response = await fetch(`${BASE_URL}/api/?class=documents&action=createCategory`, {
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

export async function updateCategory(data, auth, setMessage) {
	const response = await fetch(`${BASE_URL}/api/?class=documents&action=updateCategory`, {
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

export async function deleteCategory(id, auth, setMessage) {
	const response = await fetch(`${BASE_URL}/api/?class=documents&action=deleteCategory`, {
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

/**
 * * Functions for documents
 */

export async function getByCategory(id, setImages, auth) {
	const response = await fetch(`${BASE_URL}/api/?class=documents&action=getByCategory`, {
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
	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	return data;
}

export async function getImageCategories(id, setPickedCategories, auth) {
	const response = await fetch(`${BASE_URL}/api/?class=documents&action=getImageCategories`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ image_id: id, token: auth.userInfo.token }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const data = await response.json();

	setPickedCategories(data.data);
	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	return data;
}

export async function multipleCreate(data, auth) {
	const response = await fetch(`${BASE_URL}/api/?class=documents&action=multipleCreate`, {
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
	return;
}

export async function multipleDelete(ids, auth, setMessage) {
	const response = await fetch(`${BASE_URL}/api/?class=documents&action=multipleDelete`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ data: ids, token: auth.userInfo.token }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const data = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	setMessage({ action: "success", text: "Obrázky byly smazány" });
	return;
}
