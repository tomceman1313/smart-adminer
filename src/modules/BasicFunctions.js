import {
	faCircleCheck,
	faClockRotateLeft,
	faMinus,
	faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//dev
//export const publicPath = "/admin";
//production
//export const publicPath = "https://seniori.domov-sulicka.cz/admin";
export const publicPath = process.env.REACT_APP_PUBLIC_PATH;
/**
 ** Creates random ID for temporary use
 * @returns number
 */
export function createUniqId() {
	return Math.random().toString(36).substring(2, 10);
}

/**
 ** Creates date string
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns string (20230817)
 */
export function makeDate(year, month, day) {
	let date = `${year}`;

	month < 10 ? (date += `0${month}`) : (date += month);
	day < 10 ? (date += `0${day}`) : (date += day);
	return date;
}

export function getTodayDate() {
	const today = new Date();
	const numericDate = makeDate(
		today.getFullYear(),
		today.getMonth() + 1,
		today.getDate()
	);
	return makeDateFormat(numericDate, "str");
}

/**
 * @param {number} date - date number (20230720)
 * @param {string} direction - str = yyyy-MM-DD, text = DD.MM.yyyy
 * @returns {string}
 */
export function makeDateFormat(date, direction) {
	if (date === 0 || !date) {
		return "";
	}

	if (date === "") {
		return "0";
	}
	let dateStr = date.toString();
	let dateFormatted;

	if (direction === "str") {
		dateFormatted =
			dateStr.slice(0, 4) +
			"-" +
			dateStr.slice(4, 6) +
			"-" +
			dateStr.slice(6, 8);
		//dateFormatted = dateStr.slice(6, 8) + "." + dateStr.slice(4, 6) + "." + dateStr.slice(0, 4);
	} else if (direction === "text") {
		//dateFormatted = dateStr.slice(0, 4) + "-" + dateStr.slice(4, 6) + "-" + dateStr.slice(6, 8);
		dateFormatted =
			dateStr.slice(6, 8) +
			"." +
			dateStr.slice(4, 6) +
			"." +
			dateStr.slice(0, 4);
	} else {
		let dateArray = dateStr.split("-");
		dateFormatted = Number(dateArray[0] + dateArray[1] + dateArray[2]);
	}
	return dateFormatted;
}

/**
 * * Vytvoří pole objektů pro kalendář
 * @param {array} data
 * @returns Array objektů pro kalendář
 */
export function createEventsArray(data) {
	let events = [];
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
	const dateNow = Number(
		makeDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
	);
	if (start === 0 || end === 0) {
		return (
			<FontAwesomeIcon
				id={css.status_icon}
				icon={faMinus}
				style={{ color: "gray" }}
				title="Nedostupné"
			/>
		);
	}

	if (dateNow >= start && dateNow <= end) {
		return (
			<FontAwesomeIcon
				id={css.status_icon}
				icon={faCircleCheck}
				style={{ color: "var(--green)" }}
				title="Aktivní"
			/>
		);
	}

	return (
		<FontAwesomeIcon
			id={css.status_icon}
			icon={faClockRotateLeft}
			style={{ color: "orange" }}
			title="Neaktivní"
		/>
	);
}

/**
 * * Vybere správnou ikonu podle přiděleného práva
 * Ikona OK nebo Křížek
 * @param {int} permission
 * @returns Ikona
 */

export function isPermitted(permission, onClick) {
	if (permission === 1) {
		return (
			<FontAwesomeIcon
				icon={faCircleCheck}
				onClick={onClick ? onClick : () => {}}
				style={{ color: "var(--green)" }}
				title="Povoleno"
			/>
		);
	} else {
		return (
			<FontAwesomeIcon
				icon={faCircleXmark}
				onClick={onClick ? onClick : () => {}}
				style={{ color: "var(--red)" }}
				title="Zakázáno"
			/>
		);
	}
}

/**
 * * Opens new tab with given url
 * @param {string} url
 */

export function openImage(url) {
	window.open(url, "_blank").focus();
}

export function convertBase64(file) {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);

		fileReader.onload = () => {
			resolve(fileReader.result);
		};

		fileReader.onerror = (error) => {
			reject(error);
		};
	});
}

/**
 * * Slice piece of array based on page number
 * ? This function have to be imported inside loadData function instead of setState
 * ? Also useEffect[page] have to be created for notice change and rerun this function for data change
 * @param {array} data - source data
 * @param {number} numberOfItemsPerPage - how many items will returned slice have
 * @param {number} page - current page number
 * @param {React.setState} setState - setState for set sliced array
 */
export function sliceDataBasedOnPageNumber(
	data,
	numberOfItemsPerPage,
	page,
	setState
) {
	const multiplier = page ? page - 1 : 0;
	const start = numberOfItemsPerPage * multiplier;
	const end = start + numberOfItemsPerPage;

	const slicedData = data.slice(start, end);
	setState(slicedData);
}

export function getMonthName(monthNumber, localShortcut) {
	let objDate = new Date();
	objDate.setDate(1);
	objDate.setMonth(monthNumber - 1);

	let locale = localShortcut;
	let month = objDate.toLocaleString(locale, { month: "long" });
	month = month.charAt(0).toUpperCase() + month.slice(1);
	return month;
}
