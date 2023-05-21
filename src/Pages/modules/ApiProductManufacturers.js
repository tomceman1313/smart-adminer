import { BASE_URL } from "./ApiFunctions";

export async function getManufacturers(setState) {
	const response = await fetch(`${BASE_URL}/api/?class=products&action=getManufacturers`, {
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

export async function createManufacturer(data, auth, setMessage) {
	const response = await fetch(`${BASE_URL}/api/?class=products&action=createManufacturer`, {
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
	setMessage({ action: "success", text: "Výrobce byla přidán" });
}

export async function updateManufacturer(data, auth, setMessage) {
	const response = await fetch(`${BASE_URL}/api/?class=products&action=updateManufacturer`, {
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
	setMessage({ action: "success", text: "Výrobce byl upraven" });
}

export async function deleteManufacturer(id, auth, setMessage) {
	const response = await fetch(`${BASE_URL}/api/?class=products&action=deleteManufacturer`, {
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
	setMessage({ action: "success", text: "Výrobce byl smazán" });
}
