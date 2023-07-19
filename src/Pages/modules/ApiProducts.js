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

export async function getProduct(id) {
	const response = await fetch(`${BASE_URL}/api/?class=products&action=get&id=${id}`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		credentials: "include",
	});

	if (response.status === 403) {
		return null;
	}

	let data = await response.json();

	data.variants.map((el) => {
		el.parameters = JSON.parse(el.parameters);
		return el;
	});

	return data;
}

export async function deleteProduct(id, auth, setMessage) {
	const response = await fetch(`${BASE_URL}/api/?class=products&action=delete&id=${id}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ token: auth.userInfo.token }),
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

export async function deleteImage(name, id, auth, setMessage) {
	const response = await fetch(`${BASE_URL}/api/?class=products&action=delete-image&id=${id}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ name: name, token: auth.userInfo.token }),
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
