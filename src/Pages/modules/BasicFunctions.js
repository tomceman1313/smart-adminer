import { faCircleCheck, faClockRotateLeft, faMinus, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

/**
 * * Vytvoří pole objektů pro kalendář
 * @param {array} data
 * @returns Array objektů pro kalendář
 */
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

/**
 * * Vybere vhodnou ikonu podle aktuálnosti akční ceny
 * @param {int} start: začátek akce
 * @param {int} end: konec akce
 * @returns navrací ikonu podle aktuálnosti akce
 */
export function isActive(start, end, css) {
	const date = new Date();
	const dateNow = Number(makeDate(date.getFullYear(), date.getMonth() + 1, date.getDate()));
	if (start == 0 || end == 0) {
		return <FontAwesomeIcon id={css.status_icon} icon={faMinus} style={{ color: "gray" }} title="Nedostupné" />;
	}

	if (dateNow >= start && dateNow <= end) {
		return <FontAwesomeIcon id={css.status_icon} icon={faCircleCheck} style={{ color: "var(--green)" }} title="Aktivní" />;
	}

	return <FontAwesomeIcon id={css.status_icon} icon={faClockRotateLeft} style={{ color: "orange" }} title="Neaktivní" />;
}

/**
 * * Vybere správnou ikonu podle přiděleného práva
 * Ikona OK nebo Křížek
 * @param {int} permission
 * @returns Ikona
 */

export function isPermitted(permission) {
	if (permission === 1) {
		return <FontAwesomeIcon icon={faCircleCheck} style={{ color: "var(--green)" }} title="Povoleno" />;
	} else {
		return <FontAwesomeIcon icon={faCircleXmark} style={{ color: "var(--red)" }} title="Zakázáno" />;
	}
}

/**
 * * Otevře nový tab s obrázkem
 * @param {string} url
 */

export function openImage(url) {
	window.open(url, "_blank").focus();
}
