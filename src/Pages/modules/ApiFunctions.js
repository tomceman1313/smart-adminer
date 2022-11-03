export function getAll(apiClass, setState) {
	fetch(`http://localhost:4300/api?class=${apiClass}&action=getall`).then((response) => {
		response.text().then((_data) => {
			const data = JSON.parse(_data);
			setState(data);
		});
	});
}

export function get(apiClass, id) {
	fetch(`http://localhost:4300/api?class=${apiClass}&action=get`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ id: id }),
	}).then((response) => {
		response.text().then((_data) => {
			const data = JSON.parse(_data);
			return data;
		});
	});
}

export function create(apiClass, data, setAlert, positiveText, negativeText) {
	fetch(`http://localhost:4300/api?class=${apiClass}&action=create`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify(data),
	})
		.then((response) => {
			if (response.status === 201) {
				setAlert({ action: "success", text: positiveText, timeout: 6000 });
			} else {
				setAlert({ action: "failure", text: negativeText, timeout: 6000 });
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

export function edit(apiClass, data, setAlert, positiveText, negativeText) {
	fetch(`http://localhost:4300/api?class=${apiClass}&action=update`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify(data),
	})
		.then((response) => {
			if (response.status === 200) {
				setAlert({ action: "success", text: positiveText, timeout: 6000 });
			} else {
				setAlert({ action: "failure", text: negativeText, timeout: 6000 });
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

export function remove(apiClass, id, setAlert, positiveText, negativeText) {
	fetch(`http://localhost:4300/api?class=${apiClass}&action=delete`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		body: JSON.stringify({ id: id }),
	})
		.then((response) => {
			if (response.status === 200) {
				setAlert({ action: "success", text: positiveText, timeout: 6000 });
			} else {
				setAlert({ action: "failure", text: negativeText, timeout: 6000 });
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

export function refreshToken(access_token) {
	if (!access_token) {
		fetch("http://localhost:4300/api?class=admin&action=refresh", {
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			body: JSON.stringify({ token: access_token }),
		}).then((response) => {
			response.text().then((_data) => {
				const data = JSON.parse(_data);
				if (data.message === "relogin") {
					return null;
				}
				return data.token;
			});
		});
	}
}
