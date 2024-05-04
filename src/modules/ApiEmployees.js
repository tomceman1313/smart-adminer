import { BASE_URL } from "./ApiFunctions";
import toast from "react-hot-toast";

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

export async function createDepartment(data, auth, positiveText) {
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
	toast.success(positiveText);
}

export async function updateDepartment(data, auth, positiveText) {
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
	toast.success(positiveText);
}

export async function removeDepartment(id, auth, positiveText) {
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
	toast.success(positiveText);
}
