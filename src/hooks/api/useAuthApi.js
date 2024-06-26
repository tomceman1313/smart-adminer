import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../../modules/ApiFunctions";
import useAuth from "../useAuth";
import useInteraction from "../useInteraction";
import { useTranslation } from "react-i18next";

export default function useAuthApi() {
	const { t } = useTranslation("login");
	const auth = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { setMessage } = useInteraction();
	const bearer = `Bearer ` + auth?.userInfo?.token;

	async function getRoles() {
		const response = await fetch(`${BASE_URL}/api/users/roles`, {
			method: "GET",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				Authorization: bearer,
			},
			credentials: "include",
		});

		const data = await response.json();
		auth.setUserInfo({ ...auth.userInfo, token: data.token });
		return data.data;
	}

	async function togglePermission(id, method, positiveText) {
		const response = await fetch(
			`${BASE_URL}/api/users/permissions/${id}/?method=${method}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
					Authorization: bearer,
				},
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
			setMessage({ action: "success", text: positiveText });
		} else {
			setMessage({
				action: "failure",
				text: "Operace se nezdařila",
				timeout: 6000,
			});
		}
	}

	async function refreshAccessToken() {
		const from = location.pathname;
		let fromPath = "/";
		if (from) {
			fromPath = from;
		}
		try {
			const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
				method: "GET",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				},
				credentials: "include",
			});
			if (response.status === 401) {
				auth.setUserInfo(null);
				navigate("/login", { state: { from: fromPath } });
				return;
			}

			const data = await response.json();
			auth.setUserInfo(data.data);
		} catch (e) {
			navigate("/503", { state: { from: fromPath } });
			auth.setUserInfo(null);
			return;
		}
	}

	async function changePassword(postData) {
		const response = await fetch(
			`${BASE_URL}/api/users/${auth.userInfo.id}/password`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
					Authorization: bearer,
				},
				body: JSON.stringify({ data: postData }),
				credentials: "include",
			}
		);

		if (response.status === 401) {
			auth.setUserInfo(null);
			return false;
		}

		const data = await response.json();
		auth.setUserInfo({ ...auth.userInfo, token: data.token });
		return true;
	}

	async function signIn(data) {
		let from = location?.state?.from || "/";
		const response = await fetch(BASE_URL + "/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			},
			credentials: "include",
			body: JSON.stringify(data),
		});

		const _data = await response.json();

		if (response.status === 200) {
			auth.setUserInfo(_data);
			navigate(from, { state: { from: location }, replace: true });
			return;
		}

		setMessage({ action: "alert", text: t("messageWrongCredentials") });
	}

	async function logOut() {
		const response = await fetch(`${BASE_URL}/api/auth/logout`, {
			method: "GET",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			},
			credentials: "include",
		});

		if (response.status === 200) {
			auth.setUserInfo(null);
		}
	}

	return {
		getRoles,
		togglePermission,
		refreshAccessToken,
		changePassword,
		signIn,
		logOut,
	};
}
