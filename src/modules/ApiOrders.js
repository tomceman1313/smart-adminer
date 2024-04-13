import { BASE_URL } from "./ApiFunctions";

export async function findById(id) {
	const response = await fetch(`${BASE_URL}/api/orders/filter/${id}`, {
		method: "GET",
	});

	const data = await response.json();
	return data;
}

export async function filterOrders(filterValues) {
	const response = await fetch(`${BASE_URL}/api/orders/filter`, {
		method: "POST",
		body: JSON.stringify(filterValues),
	});

	const data = await response.json();
	return data;
}

export async function getStatusCodes() {
	const response = await fetch(`${BASE_URL}/api/orders/statuses`, {
		method: "GET",
	});

	const data = await response.json();
	return data;
}

export async function getShippingTypes() {
	const response = await fetch(`${BASE_URL}/api/orders/shipping`, {
		method: "GET",
	});

	const data = await response.json();
	return data;
}
