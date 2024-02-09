import { BASE_URL } from "./ApiFunctions";

/**
 * * Functions for documents
 */

export async function multipleCreate(data, auth) {
	const bearer = `Bearer ${auth.userInfo.token}`;

	const response = await fetch(`${BASE_URL}/api/documents/multiple`, {
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
	const bearer = `Bearer ${auth.userInfo.token}`;

	const encodedIds = encodeURIComponent(JSON.stringify(ids));

	const response = await fetch(`${BASE_URL}/api/documents/multiple/${encodedIds}`, {
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
	setMessage({ action: "success", text: "Obrázky byly smazány" });
	return;
}
