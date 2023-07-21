import { BASE_URL } from "./ApiFunctions";

export async function getImageCategories(id, setPickedCategories) {
	const response = await fetch(`${BASE_URL}/api/?class=gallery&action=getImageCategories&id=${id}`, {
		method: "GET",
	});

	const data = await response.json();
	setPickedCategories(data);

	return data;
}

export async function multipleCreate(data, auth) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(`${BASE_URL}/api/?class=gallery&action=multipleCreate`, {
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
	return;
}

export async function multipleDelete(ids, auth, setMessage) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(`${BASE_URL}/api/?class=gallery&action=multipleDelete`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
		body: JSON.stringify({ data: ids }),
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
