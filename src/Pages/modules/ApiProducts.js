import { BASE_URL } from "./ApiFunctions";

export async function getProducts(setState) {
	const response = await fetch(`${BASE_URL}/api/?class=products&action=getall`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		credentials: "include",
	});

	if (response.status === 403) {
		return null;
	}

	const data = await response.json();
	setState(data);
	return data;
}

export async function getProductByIds(ids) {
	const response = await fetch(`${BASE_URL}/api/?class=products&action=getByIds`, {
		method: "POST",
		body: JSON.stringify(ids),
	});

	if (response.status === 403) {
		return null;
	}

	let data = await response.json();

	return data;
}

export async function getProduct(id) {
	const response = await fetch(`${BASE_URL}/api/?class=products&action=get&id=${id}`, {
		method: "GET",
	});

	if (response.status === 403) {
		return null;
	}

	let data = await response.json();

	return data;
}

export async function filterProducts(filterValues) {
	console.log(JSON.stringify(filterValues));
	const response = await fetch(`${BASE_URL}/api/?class=products&action=filter`, {
		method: "POST",
		body: JSON.stringify(filterValues),
	});

	const data = await response.json();
	return data;
}

export async function getByName(name) {
	const response = await fetch(`${BASE_URL}/api/?class=products&action=getByName&name=${name}`, {
		method: "GET",
	});

	const data = await response.json();
	return data;
}

export async function deleteProduct(id, auth, setMessage) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(`${BASE_URL}/api/?class=products&action=delete&id=${id}`, {
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
	setMessage({ action: "success", text: "Produkt byl smazán" });
}

export async function deleteImage(name, productId, auth, setMessage) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(`${BASE_URL}/api/?class=products&action=delete-image&id=${productId}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
		body: JSON.stringify({ name: name }),
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
