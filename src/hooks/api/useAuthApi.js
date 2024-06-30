import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import warningToast from "../../components/common/warning-toast/WarningToast";
import { BASE_URL, responseHandler } from "../../modules/ApiFunctions";
import useAuth from "../useAuth";

export default function useAuthApi() {
	const { t } = useTranslation("login", "profile", "errors");
	const auth = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
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
			toast.success(positiveText);
		} else {
			toast.error(t("errors:errorCRUDOperation"));
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

	async function changePassword(data) {
		const response = await fetch(
			`${BASE_URL}/api/users/${auth.userInfo.id}/password`,
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

		await responseHandler(
			response,
			auth,
			t("profile:positiveTextPasswordChanged")
		);
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
		warningToast(t("messageWrongCredentials"));
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
