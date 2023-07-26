import { BASE_URL } from "./ApiFunctions";

export async function getManufacturers(setState) {
	const response = await fetch(`${BASE_URL}/api/?class=products&action=getManufacturers`, {
		method: "GET",
	});

	if (response.status === 403) {
		return null;
	}

	const data = await response.json();
	setState(data);
	return data;
}

export async function createManufacturer(data, auth, setMessage) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(`${BASE_URL}/api/?class=products&action=createManufacturer`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
		body: JSON.stringify({ data: data }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const rdata = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: rdata.token });
	setMessage({ action: "success", text: "Výrobce byla přidán" });
}

export async function updateManufacturer(data, auth, setMessage) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(`${BASE_URL}/api/?class=products&action=updateManufacturer`, {
		method: "PUT",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
		body: JSON.stringify({ data: data }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const rdata = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: rdata.token });
	setMessage({ action: "success", text: "Výrobce byl upraven" });
}

export async function deleteManufacturer(id, auth, setMessage) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(`${BASE_URL}/api/?class=products&action=deleteManufacturer&id=${id}`, {
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
	setMessage({ action: "success", text: "Výrobce byl smazán" });
}
