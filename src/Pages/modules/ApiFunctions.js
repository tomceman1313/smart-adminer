//before production change BASE_URL, publicFolderPath.php and publicPath (BasicFunctions.js)
// change package.json a App.js router

//export const BASE_URL = "https://domov-sulicka.cz/admin";
//export const BASE_URL = "https://seniori.domov-sulicka.cz/admin";
export const BASE_URL = "http://localhost:4300";

export async function getAll(apiClass) {
	const response = await fetch(`${BASE_URL}/api/${apiClass}`, {
		method: "GET",
	});

	const data = await response.json();

	return data;
}

export async function get(apiClass, id) {
	const response = await fetch(`${BASE_URL}/api/${apiClass}/${id}`, {
		method: "GET",
	});

	const data = await response.json();
	return data;
}

/**
 *
 * @param {string} apiClass
 * @param {string} name
 * @param {string} category - optional for getting only records of given category
 * @returns object[]
 */
export async function getByName(apiClass, name, categoryId) {
	const categoryParam = `&categoryId=${categoryId}`;
	const response = await fetch(`${BASE_URL}/api/${apiClass}/?name=${name}${categoryId ? categoryParam : ""}`, {
		method: "GET",
	});

	const data = await response.json();
	return data;
}

export async function checkNameAvailability(apiClass, name) {
	const response = await fetch(`${BASE_URL}/api/${apiClass}/name/?name=${name}`, {
		method: "GET",
	});

	const data = await response.json();
	return data;
}

export async function getByCategory(apiClass, id) {
	const response = await fetch(`${BASE_URL}/api/${apiClass}/?category=${id}`, {
		method: "GET",
	});

	const data = await response.json();
	return data;
}

export async function create(apiClass, data, setMessage, positiveText, auth) {
	const bearer = `Bearer ` + auth.userInfo.token;
	const response = await fetch(`${BASE_URL}/api/${apiClass}`, {
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

	const response = await fetch(`${BASE_URL}/api/${apiClass}/${data.id}`, {
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

	const response = await fetch(`${BASE_URL}/api/${apiClass}/${id}`, {
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

export async function updateOrder(apiClass, data, setMessage, positiveText, auth) {
	const bearer = `Bearer ${auth.userInfo.token}`;

	const response = await fetch(`${BASE_URL}/api/${apiClass}/order`, {
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
	return;
}

export async function deleteImage(apiClass, id, imageId, auth, setMessage) {
	const bearer = `Bearer ${auth.userInfo.token}`;
	const response = await fetch(`${BASE_URL}/api/${apiClass}/${id}/images/${imageId}`, {
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
	if (response.status === 200) {
		setMessage({ action: "success", text: "Obrázek byl smazán" });
	} else {
		setMessage({ action: "failure", text: "Smazání položky nebylo provedeno", timeout: 6000 });
	}
}

export async function getAllWithAuth(apiClass, auth) {
	const bearer = `Bearer ${auth.userInfo.token}`;
	const response = await fetch(`${BASE_URL}/api/${apiClass}`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
		credentials: "include",
	});

	const data = await response.json();
	//auth.setUserInfo({ ...auth.userInfo, token: data.token });
	return data.data;
}

export async function getWithAuth(apiClass, id, auth) {
	const bearer = `Bearer ${auth.userInfo.token}`;
	const response = await fetch(`${BASE_URL}/api/${apiClass}/${id}`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
		credentials: "include",
	});

	const data = await response.json();
	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	return data.data;
}
