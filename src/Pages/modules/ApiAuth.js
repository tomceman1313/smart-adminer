import { BASE_URL } from "./ApiFunctions";

export async function getRoles(setState, auth) {
	const bearer = `Bearer ${auth.userInfo.token}`;
	const response = await fetch(`${BASE_URL}/api/users/roles`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
		credentials: "include",
	});

	const data = await response.json();
	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	setState(data.data);
	return data.data;
}

export async function togglePermission(id, method, setMessage, auth) {
	const bearer = `Bearer ${auth.userInfo.token}`;
	const response = await fetch(`${BASE_URL}/api/users/permissions/${id}/?method=${method}`, {
		method: "PUT",
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

export async function refreshAccessToken(navigate, from, auth) {
	let fromPath = "/";
	if (from) {
		fromPath = from;
	}
	const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		credentials: "include",
	});

	if (response.status === 401) {
		auth.setUserInfo(null);
		navigate("/login", { state: { from: fromPath } });
		return;
	}

	const data = await response.json();
	auth.setUserInfo(data.data);
}

export async function getUserData(auth) {
	const bearer = `Bearer ${auth.userInfo.token}`;
	const response = await fetch(`${BASE_URL}/api/?class=users&action=get&id=${auth.userInfo.id}`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return false;
	}

	const data = await response.json();
	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	return data.data;
}

export async function changePassword(postData, auth) {
	const response = await fetch(`${BASE_URL}/api/?class=users&action=change_password`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ data: postData, token: auth.userInfo.token }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return false;
	}

	const data = await response.json();
	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	return data.success;
}

export async function logOut(auth) {
	const response = await fetch(`${BASE_URL}/api/auth/logout`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		credentials: "include",
	});

	if (response.status === 200) {
		auth.setUserInfo(null);
	}
}
