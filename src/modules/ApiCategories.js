import { BASE_URL } from "./ApiFunctions";

export async function getCategories(setState, apiClass) {
	const response = await fetch(`${BASE_URL}/api/${apiClass}/categories`, {
		method: "GET",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		},
		credentials: "include",
	});

	if (response.status === 401) {
		return null;
	}

	const data = await response.json();
	setState(data);
	return data;
}

export async function createCategory(
	apiClass,
	data,
	setMessage,
	positiveText,
	auth
) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(`${BASE_URL}/api/${apiClass}/categories`, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			Authorization: bearer,
		},
		body: JSON.stringify({ data: data }),
		credentials: "include",
	});

	if (response.status === 401) {
		auth.setUserInfo(null);
		return null;
	}

	const rdata = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: rdata.token });
	setMessage({ action: "success", text: positiveText });
}

export async function updateCategory(
	apiClass,
	data,
	setMessage,
	positiveText,
	auth
) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(
		`${BASE_URL}/api/${apiClass}/categories/${data.id}`,
		{
			method: "PUT",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				Authorization: bearer,
			},
			body: JSON.stringify({ data: data }),
			credentials: "include",
		}
	);

	if (response.status === 401) {
		auth.setUserInfo(null);
		return null;
	}

	const rdata = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: rdata.token });
	setMessage({ action: "success", text: positiveText });
}

export async function deleteCategory(
	apiClass,
	id,
	setMessage,
	positiveText,
	auth
) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(`${BASE_URL}/api/${apiClass}/categories/${id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			Authorization: bearer,
		},
		credentials: "include",
	});

	if (response.status === 401) {
		auth.setUserInfo(null);
		return null;
	}

	const data = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	setMessage({ action: "success", text: positiveText });
}
