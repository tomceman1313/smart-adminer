import { BASE_URL } from "./ApiFunctions";

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
	let fromPath = "/";
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
	const bearer = `Bearer ${auth.userInfo.token}`;
	const response = await fetch(`${BASE_URL}/api/?class=admin&action=get&id=${auth.userInfo.id}`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Authorization: bearer },
		credentials: "include",
	});

	if (response.status === 403) {
		auth.setUserInfo(null);
		return false;
	}

	const data = await response.json();
	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	return data.data;
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

export async function logOut(auth) {
	const response = await fetch(`${BASE_URL}/api/?class=admin&action=logout`, {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		credentials: "include",
	});

	if (response.status === 200) {
		console.log(auth);
		auth.setUserInfo(null);
	}
}
