const BASE_URL = "http://localhost:4300";

export async function getCategories() {
	const response = await fetch(`${BASE_URL}/gallery/category`, {
		method: "GET",
		credentials: "include",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
	});
}
