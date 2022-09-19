export function makeDate(year, month, day) {
	let date = `${year}`;

	month < 10 ? (date += `0${month}`) : (date += month);
	day < 10 ? (date += `0${day}`) : (date += day);
	return date;
}

export function makeDateFormat(date, direction) {
	let dateStr = date.toString();
	let dateFormated;
	if (date === 0) {
		return "";
	}

	if (date === "") {
		return "0";
	}

	if (direction == "str") {
		dateFormated = dateStr.slice(0, 4) + "-" + dateStr.slice(4, 6) + "-" + dateStr.slice(6, 8);
	} else {
		let dateArray = dateStr.split("-");
		dateFormated = Number(dateArray[0] + dateArray[1] + dateArray[2]);
	}
	return dateFormated;
}

export function createEventsArray(data) {
	let events = new Array();
	data.forEach((el) => {
		events.push({
			title: el.name,
			start: makeDateFormat(el.special_price_start, "str"),
			end: makeDateFormat(el.special_price_end, "str"),
			id: el.id,
			backgroundColor: "#2874a6",
		});
	});
	return events;
}
