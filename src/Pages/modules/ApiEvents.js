import { BASE_URL } from "./ApiFunctions";

export async function getEvent(id, token, navigation) {
	//console.log(JSON.stringify({ id: id, token: token }));
	const response = await fetch(`${BASE_URL}/api/?class=events&action=get`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ id: id, token: token }),
		credentials: "include",
	});

	if (response.status === 403) {
		navigation("/login");
		return;
	}

	const article = await response.json();
	return article;
}

export async function createEvent(data, auth, setMessage) {
	const response = await fetch(BASE_URL + "/api/?class=events&action=create", {
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

export async function updateEvent(data, auth, setMessage) {
	const response = await fetch(BASE_URL + "/api/?class=events&action=update", {
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
	setMessage({ action: "success", text: "Událost byla upravena" });
	return;
}

export async function deleteEvent(id, auth, setMessage, navigation) {
	const response = await fetch(`${BASE_URL}/api/?class=events&action=delete`, {
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
	navigation("/dashboard/events");
	if (response.status === 200) {
		setMessage({ action: "success", text: "Článek byl smazán" });
	} else {
		setMessage({ action: "failure", text: "Smazání položky nebylo provedeno", timeout: 6000 });
	}
	return;
}

export async function deleteImage(name, auth, setMessage) {
	const response = await fetch(`${BASE_URL}/api/?class=events&action=delete-image`, {
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
