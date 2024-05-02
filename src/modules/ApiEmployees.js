import { BASE_URL } from "./ApiFunctions";

export async function getDepartments() {
	const response = await fetch(`${BASE_URL}/api/employees/departments`, {
		method: "GET",
	});

	if (response.status === 401) {
		return null;
	}

	let data = await response.json();
	return data;
}

export async function createDepartment(data, auth, setMessage, positiveText) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(`${BASE_URL}/api/employees/departments`, {
		method: "POST",
		headers: {
			Authorization: bearer,
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		},
		body: JSON.stringify(data),
		credentials: "include",
	});

	if (response.status === 401) {
		auth.setUserInfo(null);
		return null;
	}

	const responseData = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: responseData.token });
	setMessage({ action: "success", text: positiveText });
}

export async function updateDepartment(data, auth, setMessage, positiveText) {
	const bearer = `Bearer ` + auth.userInfo.token;

	const response = await fetch(
		`${BASE_URL}/api/employees/departments/${data.id}`,
		{
			method: "PUT",
			headers: {
				Authorization: bearer,
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			},
			body: JSON.stringify(data),
			credentials: "include",
		}
	);

	if (response.status === 401) {
		auth.setUserInfo(null);
		return null;
	}

	const responseData = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: responseData.token });
	setMessage({ action: "success", text: positiveText });
}

export async function removeDepartment(id, auth, setMessage, positiveText) {
	const bearer = `Bearer ${auth.userInfo.token}`;

	const response = await fetch(`${BASE_URL}/api/employees/departments/${id}`, {
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
