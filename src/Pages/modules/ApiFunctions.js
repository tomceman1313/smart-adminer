//before production change BASE_URL, publicFolderPath.php and publicPath (BasicFunctions.js)
// change package.json a App.js router

//export const BASE_URL = "https://smart-studio.cz/demo/sulicka/admin";
export const BASE_URL = "http://localhost:4300";

export async function getAll(apiClass) {
	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=getall`, {
		method: "GET",
	});

	const data = await response.json();

	return data;
}

export async function get(apiClass, id) {
	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=get&id=${id}`, {
		method: "GET",
	});

	const data = await response.json();
	return data;
}

export async function getByName(apiClass, name) {
	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=get&name=${name}`, {
		method: "GET",
	});

	const data = await response.json();
	return data;
}

export async function checkNameAvailability(apiClass, name) {
	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=checkNameAvailability`, {
		method: "POST",
		body: JSON.stringify({ name: name }),
	});

	const data = await response.json();
	return data;
}

export async function getByCategory(apiClass, id) {
	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=getByCategory&id=${id}`, {
		method: "GET",
	});

	const data = await response.json();
	return data;
}

export async function create(apiClass, data, setMessage, positiveText, auth) {
	const bearer = `Bearer ` + auth.userInfo.token;
	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=create`, {
		method: "POST",
		headers: {
			Authorization: bearer,
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		},
		body: JSON.stringify({ data: data }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const rdata = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: rdata.token });
	setMessage({ action: "success", text: positiveText });
}

export async function edit(apiClass, data, setMessage, positiveText, auth) {
	const bearer = `Bearer ${auth.userInfo.token}`;

	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=update`, {
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
	setMessage({ action: "success", text: positiveText });
}

export async function remove(apiClass, id, setMessage, positiveText, auth) {
	const bearer = `Bearer ${auth.userInfo.token}`;

	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=delete&id=${id}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const rdata = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: rdata.token });
	setMessage({ action: "success", text: positiveText });
}

export async function deleteImage(apiClass, name, auth, setMessage) {
	const bearer = `Bearer ${auth.userInfo.token}`;
	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=delete-image`, {
		method: "DELETE",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
		body: JSON.stringify({ name: name }),
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

export async function getAllWithAuth(apiClass, auth) {
	const bearer = `Bearer ${auth.userInfo.token}`;
	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=getall`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
		credentials: "include",
	});

	const data = await response.json();
	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	return data.data;
}

export async function getWithAuth(apiClass, id, auth) {
	const bearer = `Bearer ${auth.userInfo.token}`;
	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=get&id=${id}`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
		credentials: "include",
	});

	const data = await response.json();
	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	return data.data;
}
