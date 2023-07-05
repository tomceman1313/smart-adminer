import { BASE_URL } from "./ApiFunctions";

export async function getArticle(id, navigation) {
	//console.log(JSON.stringify({ id: id, token: token }));
	const response = await fetch(`${BASE_URL}/api/?class=articles&action=get`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ id: id }),
		credentials: "include",
	});

	if (response.status === 403) {
		navigation("/login");
		return;
	}

	const article = await response.json();
	return article;
}

export async function getByCategory(categoryId) {
	const response = await fetch(`${BASE_URL}/api/?class=articles&action=get-by-category`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ category_id: categoryId }),
		credentials: "include",
	});

	const data = await response.json();
	return data;
}

export async function createArticle(data, auth, setMessage) {
	const response = await fetch(BASE_URL + "/api/?class=articles&action=create", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ data: data, token: auth.userInfo.token }),
		credentials: "include",
	});

	if (response.status === 201) {
		setMessage({ action: "success", text: "Uloženo" });
	} else {
		setMessage({ action: "failure", text: "Operace selhala" });
	}

	const rdata = await response.json();
	auth.setUserInfo({ ...auth.userInfo, token: rdata.token });
	return;
}

export async function updateArticle(data, auth, setMessage) {
	const response = await fetch(BASE_URL + "/api/?class=articles&action=update", {
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
	setMessage({ action: "success", text: "Článek byl upraven" });
	return;
}

export async function deleteArticle(id, auth, setMessage, navigation) {
	const response = await fetch(`${BASE_URL}/api/?class=articles&action=delete`, {
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
	if (response.status === 200) {
		setMessage({ action: "success", text: "Článek byl smazán" });
		navigation("/dashboard/articles");
	} else {
		setMessage({ action: "failure", text: "Smazání položky nebylo provedeno", timeout: 6000 });
	}
}

export async function deleteImage(name, auth, setMessage) {
	const response = await fetch(`${BASE_URL}/api/?class=articles&action=delete-image`, {
		method: "POST",
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
