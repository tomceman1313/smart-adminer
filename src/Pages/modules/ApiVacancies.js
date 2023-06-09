import { BASE_URL } from "./ApiFunctions";

export async function get(id) {
	const response = await fetch(`${BASE_URL}/api/?class=vacancies&action=get&id=${id}`, {
		method: "GET",
	});

	if (response.status === 403) {
		return null;
	}

	const data = await response.json();
	return data.data;
}

export async function getAll() {
	const response = await fetch(`${BASE_URL}/api/?class=vacancies&action=getall`, {
		method: "GET",
	});

	if (response.status === 403) {
		return null;
	}

	let data = await response.json();
	return data.data;
}

export async function create(data, auth, setMessage) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(`${BASE_URL}/api/?class=vacancies&action=create`, {
		method: "POST",
		headers: {
			"Authorization": bearer,
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		},
		body: JSON.stringify({ data: data }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const responseData = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: responseData.token });
	setMessage({ action: "success", text: "Inzerát byl vytvořen" });
}

export async function update(data, auth, setMessage) {
	const bearer = `Bearer ${auth.userInfo.token}`;

	const response = await fetch(`${BASE_URL}/api/?class=vacancies&action=update&id=${data.id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
		body: JSON.stringify({ data: data }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const responseData = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: responseData.token });
	setMessage({ action: "success", text: "Inzerát byl upraven" });
}

export async function remove(id, auth, setMessage) {
	const bearer = `Bearer ${auth.userInfo.token}`;

	const response = await fetch(`${BASE_URL}/api/?class=vacancies&action=delete&id=${id}`, {
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
	setMessage({ action: "success", text: "Inzerát byl smazán" });
}
