const BASE_URL = "http://localhost:4300";

export async function getAll(apiClass, setState, auth) {
	const response = await fetch(`${BASE_URL}/api?class=${apiClass}&action=getall`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ token: auth.userInfo.token }),
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return null;
	}

	const data = await response.json();

	setState(data.data);
	auth.setUserInfo({ ...auth.userInfo, token: data.token });

	return data;
}

export function get(apiClass, id) {
	fetch(`${BASE_URL}/api?class=${apiClass}&action=get`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ id: id }),
		credentials: "include",
	}).then((response) => {
		response.text().then((_data) => {
			const data = JSON.parse(_data);
			return data;
		});
	});
}

export function getRoles(setState, auth) {
	fetch(`${BASE_URL}/api?class=admin&action=getroles`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ token: auth.userInfo.token }),
		credentials: "include",
	}).then((response) => {
		if (response.status === 403) {
			auth.setUserInfo(null);
			return false;
		}
		response.text().then((_data) => {
			const data = JSON.parse(_data);
			setState(data.data);
			auth.setUserInfo({ ...auth.userInfo, token: data.token });
		});
	});
}

export function create(apiClass, data, setAlert, positiveText, negativeText, auth) {
	fetch(`${BASE_URL}/api?class=${apiClass}&action=create`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ data: data, token: auth.userInfo.token }),
		credentials: "include",
	})
		.then((response) => {
			if (response.status === 403) {
				auth.setUserInfo(null);
				return false;
			}
			if (response.status === 201) {
				setAlert({ action: "success", text: positiveText, timeout: 6000 });
				//auth.setUserInfo({...auth.userInfo, token: });
			} else {
				setAlert({ action: "failure", text: negativeText, timeout: 6000 });
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

export function edit(apiClass, data, setAlert, positiveText, negativeText, auth) {
	fetch(`${BASE_URL}/api?class=${apiClass}&action=update`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ data: data, token: auth.userInfo.token }),
		credentials: "include",
	})
		.then((response) => {
			if (response.status === 403) {
				auth.setUserInfo(null);
				return false;
			}

			if (response.status === 200) {
				setAlert({ action: "success", text: positiveText, timeout: 6000 });
			} else {
				setAlert({ action: "failure", text: negativeText, timeout: 6000 });
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

export function editRole(data, setAlert, positiveText, negativeText, auth) {
	fetch(`${BASE_URL}/api?class=admin&action=update_role`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ data: data, token: auth.userInfo.token }),
		credentials: "include",
	})
		.then((response) => {
			if (response.status === 403) {
				auth.setUserInfo(null);
				return false;
			}
			if (response.status === 200) {
				setAlert({ action: "success", text: positiveText, timeout: 6000 });
			} else {
				setAlert({ action: "failure", text: negativeText, timeout: 6000 });
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

export function remove(apiClass, id, setAlert, positiveText, negativeText, auth) {
	fetch(`${BASE_URL}/api?class=${apiClass}&action=delete`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ id: id, token: auth.userInfo.token }),
		credentials: "include",
	})
		.then((response) => {
			if (response.status == 403) {
				auth.setUserInfo(null);
				return false;
			}
			if (response.status === 200) {
				setAlert({ action: "success", text: positiveText, timeout: 6000 });
			} else {
				setAlert({ action: "failure", text: negativeText, timeout: 6000 });
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

export function refreshAccessToken(navigate, auth) {
	fetch(`${BASE_URL}/api?class=admin&action=refresh`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		credentials: "include",
	}).then((response) => {
		if (response.status === 401) {
			auth.setUserInfo(null);
			navigate("/login");
			return;
		}
		response.text().then((_data) => {
			let data = JSON.parse(_data);
			auth.setUserInfo(data.user);
		});
	});
}

export async function testFetch() {
	const response = await fetch(`${BASE_URL}/api?class=admin&action=test`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		credentials: "include",
	});

	const data = await response.json();
	return data;
}

export async function getUserData(auth) {
	const response = await fetch(`${BASE_URL}/api?class=admin&action=get`, {
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
	const response = await fetch(`${BASE_URL}/api?class=admin&action=get`, {
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
	const response = await fetch(`${BASE_URL}/api?class=admin&action=change_password`, {
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
