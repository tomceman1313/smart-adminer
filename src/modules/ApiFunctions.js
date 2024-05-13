import toast from "react-hot-toast";
import i18next from "i18next";

export const BASE_URL = process.env.REACT_APP_API_URL;

export async function responseHandler(response, auth, positiveText) {
	if (response.status === 500) {
		const fullResponse = await response.clone().text();
		console.log(fullResponse);
		return null;
	}

	if (response.status === 403) {
		toast.error(i18next.t("errors:error403"));
		return null;
	}

	if (response.status === 401) {
		auth.setUserInfo(null);
		toast.error(i18next.t("errors:error401"));
		return null;
	}

	if (!isValidJSON(await response.clone().text())) {
		return;
	}

	if (positiveText) {
		toast.success(positiveText);
	}

	const data = await response.json();
	return data;
}

function isValidJSON(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		console.log(str);
		return false;
	}
	return true;
}
