export function makeDate(year, month, day) {
	let date = `${year}`;

	month < 10 ? (date += `0${month}`) : (date += month);
	day < 10 ? (date += `0${day}`) : (date += day);
	return date;
}

export function makeDateFormat(date, direction) {
	let dateStr = date.toString();
	let dateFormated;
	if (direction == "str") {
		dateFormated = dateStr.slice(0, 4) + "-" + dateStr.slice(4, 6) + "-" + dateStr.slice(6, 8);
	} else {
		let dateArray = dateStr.split("-");
		dateFormated = Number(dateArray[0] + dateArray[1] + dateArray[2]);
	}
	return dateFormated;
}
