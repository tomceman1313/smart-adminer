import { BASE_URL } from "./ApiFunctions";

export async function filterProducts(filterValues) {
	console.log(JSON.stringify(filterValues));
	const response = await fetch(`${BASE_URL}/api/products/filter`, {
		method: "POST",
		body: JSON.stringify(filterValues),
	});

	const data = await response.json();
	return data;
}

export async function getByName(name) {
	const response = await fetch(`${BASE_URL}/api/products/?name=${name}`, {
		method: "GET",
	});

	const data = await response.json();
	return data;
}
