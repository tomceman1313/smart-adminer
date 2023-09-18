//before production change BASE_URL, publicFolderPath.php and publicPath (BasicFunctions.js)

//export const BASE_URL = "https://smart-studio.fun/admin";
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

export async function getByCategory(apiClass, id) {
	const response = await fetch(`${BASE_URL}/api/?class=${apiClass}&action=getByCategory&id=${id}`, {
		method: "GET",
	});

	const data = await response.json();
	return data;
}

export async function getRoles(setState, auth) {
	const bearer = `Bearer ${auth.userInfo.token}`;
	const response = await fetch(`${BASE_URL}/api/?class=admin&action=getroles`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
		credentials: "include",
	});

	const data = await response.json();
	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	setState(data.data);
	return data.data;
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

export function editRole(data, setAlert, positiveText, auth) {
	fetch(`${BASE_URL}/api/?class=admin&action=update_role`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ data: data }),
		credentials: "include",
	})
		.then((response) => {
			if (response.status === 403) {
				auth.setUserInfo(null);
				return false;
			}
			if (response.status === 200) {
				setAlert({ action: "success", text: positiveText });
			} else {
				setAlert({ action: "failure", text: "Operace se nezdařila" });
			}

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return;
		})
		.catch((error) => {
			console.error("There has been a problem with your fetch operation:", error);
		});
}

export function refreshAccessToken(navigate, from, auth) {
	let fromPath = "/dashboard";
	if (from) {
		fromPath = from;
	}
	fetch(`${BASE_URL}/api/?class=admin&action=refresh`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		credentials: "include",
	}).then((response) => {
		if (response.status === 401) {
			auth.setUserInfo(null);
			navigate("/login", { state: { from: fromPath } });
			return;
		}
		response.text().then((_data) => {
			let data = JSON.parse(_data);
			auth.setUserInfo(data.user);
		});
	});
}

export async function getUserData(auth) {
	const response = await fetch(`${BASE_URL}/api/?class=admin&action=get`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ id: auth.userInfo.id, token: auth.userInfo.token }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return false;
	}

	const data = await response.json();
	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	return data;
}

export async function editUserData(postData, auth) {
	const response = await fetch(`${BASE_URL}/api/?class=admin&action=get`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ data: postData, token: auth.userInfo.token }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return false;
	}

	const data = await response.json();
	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	return data;
}

export async function changePassword(postData, auth) {
	const response = await fetch(`${BASE_URL}/api/?class=admin&action=change_password`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ data: postData, token: auth.userInfo.token }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return false;
	}

	const data = await response.json();
	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	return data.success;
}
