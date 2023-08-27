import { BASE_URL } from "./ApiFunctions";

export async function findById(id) {
	const response = await fetch(`${BASE_URL}/api/?class=orders&action=findById&id=${id}`, {
		method: "GET",
	});

	const data = await response.json();
	return data;
}

export async function filterOrders(filterValues) {
	const response = await fetch(`${BASE_URL}/api/?class=orders&action=filterOrders`, {
		method: "POST",
		body: JSON.stringify(filterValues),
	});

	const data = await response.json();
	return data;
}

export async function getShippingTypes() {
	const response = await fetch(`${BASE_URL}/api/?class=orders&action=getShippingTypes`, {
		method: "GET",
	});

	const data = await response.json();
	return data;
}
