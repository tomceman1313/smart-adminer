import { BASE_URL } from "./ApiFunctions";

export async function getAll() {
	const response = await fetch(`${BASE_URL}/api/?class=employees&action=getall`, {
		method: "GET",
	});

	if (response.status === 403) {
		return null;
	}

	let data = await response.json();
	return data;
}

export async function create(data, auth, setMessage) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(`${BASE_URL}/api/?class=employees&action=create`, {
		method: "POST",
		headers: {
			Authorization: bearer,
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		},
		body: JSON.stringify(data),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const responseData = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: responseData.token });
	setMessage({ action: "success", text: "Profil zaměstnance byl vytvořen" });
}

export async function update(data, auth, setMessage) {
	const bearer = `Bearer ${auth.userInfo.token}`;

	const response = await fetch(`${BASE_URL}/api/?class=employees&action=update&id=${data.id}`, {
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
	setMessage({ action: "success", text: "Profil zaměstnance byl upraven" });
	return true;
}

export async function remove(id, auth, setMessage) {
	const bearer = `Bearer ${auth.userInfo.token}`;

	const response = await fetch(`${BASE_URL}/api/?class=employees&action=delete&id=${id}`, {
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
	setMessage({ action: "success", text: "Profil zaměstnance byl smazán" });
}

export async function getDepartments() {
	const response = await fetch(`${BASE_URL}/api/?class=employees&action=get-departments`, {
		method: "GET",
	});

	if (response.status === 403) {
		return null;
	}

	let data = await response.json();
	return data;
}

export async function createDepartment(data, auth, setMessage) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(`${BASE_URL}/api/?class=employees&action=create-department`, {
		method: "POST",
		headers: {
			Authorization: bearer,
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		},
		body: JSON.stringify(data),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const responseData = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: responseData.token });
	setMessage({ action: "success", text: "Oddělení bylo vytvořeno" });
}

export async function updateDepartment(data, auth, setMessage) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(`${BASE_URL}/api/?class=employees&action=update-department&id=${data.id}`, {
		method: "PUT",
		headers: {
			Authorization: bearer,
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		},
		body: JSON.stringify(data),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const responseData = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: responseData.token });
	setMessage({ action: "success", text: "Oddělení bylo upraveno" });
}

export async function removeDepartment(id, auth, setMessage) {
	const bearer = `Bearer ${auth.userInfo.token}`;

	const response = await fetch(`${BASE_URL}/api/?class=employees&action=delete-department&id=${id}`, {
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
	setMessage({ action: "success", text: "Oddělení bylo smazáno" });
}
