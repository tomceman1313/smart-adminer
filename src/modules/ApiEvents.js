import { BASE_URL } from "./ApiFunctions";

export async function deleteImage(name, auth, setMessage) {
	const bearer = `Bearer ${auth.userInfo.token}`;

	const response = await fetch(
		`${BASE_URL}/api/?class=events&action=delete-image`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				Authorization: bearer,
			},
			body: JSON.stringify({ name: name, token: auth.userInfo.token }),
			credentials: "include",
		}
	);

	if (response.status === 401) {
		auth.setUserInfo(null);
		return null;
	}

	const data = await response.json();

	auth.setUserInfo({ ...auth.userInfo, token: data.token });
	if (response.status === 200) {
		setMessage({ action: "success", text: "Obrázek byl smazán" });
	} else {
		setMessage({
			action: "failure",
			text: "Smazání položky nebylo provedeno",
			timeout: 6000,
		});
	}
}
