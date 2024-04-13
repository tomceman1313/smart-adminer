import { BASE_URL } from "./ApiFunctions";

export async function getImageCategories(id, setPickedCategories) {
	const response = await fetch(`${BASE_URL}/api/gallery/${id}/categories`, {
		method: "GET",
	});

	const data = await response.json();
	setPickedCategories(data);

	return data;
}
