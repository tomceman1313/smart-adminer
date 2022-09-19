import React, { useEffect, useState } from "react";
import css from "./styles/Pricelist.module.css";
import cssBasic from "./styles/Basic.module.css";

import { useForm } from "react-hook-form";
import { makeDate, makeDateFormat, createEventsArray } from "../modules/BasicFunctions";

import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faClockRotateLeft, faXmark, faMinus } from "@fortawesome/free-solid-svg-icons";
import Alert from "../Components/admin/Alert";

const Pricelist = () => {
	// array položek ceníku
	const [prices, setPrices] = useState(null);
	// name položky v ceníku, která byla vybrána v selectu
	const [selected, setSelected] = useState("");
	// array eventů
	const [events, setEvents] = useState([]);
	// ukazatel pro zobrazení Alert componentu
	const [alert, setAlert] = useState(null);

	// true / false pro zobrazení formulářů
	const [showEditCont, setShowEditCont] = useState(false);
	const [showAddItemCont, setShowAddItemCont] = useState(false);

	const date = new Date();
	const dateNow = Number(makeDate(date.getFullYear(), date.getMonth() + 1, date.getDate()));

	const { register: register, handleSubmit: handleSubmit, setValue, reset } = useForm();
	const { register: registerCreate, handleSubmit: handleSubmitCreate, reset: resetCreateForm } = useForm();

	useEffect(() => {
		getData();
		document.getElementById("banner-title").innerHTML = "Ceník";
		document.getElementById("banner-desc").innerHTML = "Úprava cen, vytváření nových položek, správa akčních cen";
	}, []);

	/**
	 * * GET request všech položek ceníku
	 */
	function getData() {
		fetch("http://localhost:4300/api?class=pricelist&action=getall").then((response) => {
			response.text().then((_data) => {
				const data = JSON.parse(_data);
				console.log(data);
				setPrices(data);
				setSelected("choose");
				setEvents(createEventsArray(data));
			});
		});
	}

	/**
	 * * POST
	 * * Funkce pro submit formuláře pro editaci položek ceníku
	 * @param {object} data
	 */
	const onSubmit = (data) => {
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);
		if (data.start > data.end) {
			setAlert({ action: "alert", text: "Datum začátku a konce akční ceny je zadáno nesprávně", timeout: 6000 });
			return;
		}
		console.log(JSON.stringify(data));
		fetch("http://localhost:4300/api?class=pricelist&action=update", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})
			.then((response) => {
				if (response.status === 200) {
					setAlert({ action: "success", text: "Uloženo", timeout: 6000 });
					editRolesCont();
					getData();
				} else {
					setAlert({ action: "failure", text: "Změna položky nebyla provedena", timeout: 6000 });
				}

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return;
			})
			.catch((error) => {
				console.error("There has been a problem with your fetch operation:", error);
			});
	};

	/**
	 * * POST
	 * * Funkce pro submit formuláře pro vytvoření položek ceníku
	 * @param {object} data
	 */
	const onSubmitCreate = (data) => {
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);
		if (data.start > data.end) {
			setAlert({ action: "alert", text: "Datum začátku a konce akční ceny je zadáno nesprávně", timeout: 6000 });
			return;
		}

		console.log(JSON.stringify(data));
		fetch("http://localhost:4300/api?class=pricelist&action=create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})
			.then((response) => {
				if (response.status === 201) {
					setAlert({ action: "success", text: "Položka vytvořena", timeout: 6000 });
					addItemCont();
					getData();
				} else {
					setAlert({ action: "failure", text: "Položka nebyla vytvořena", timeout: 6000 });
				}

				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return;
			})
			.catch((error) => {
				console.error("There has been a problem with your fetch operation:", error);
			});
	};

	/**
	 * * Naplnění formuláře při vybrání option v selectu v rámci formuláře
	 * @param e: odkaz na element option, který byl vybrán
	 */
	const handleChange = (e) => {
		let index = prices.findIndex((el) => el.name == e.target.value);
		setSelected(e.target.value);
		setValue("id", prices[index].id);
		setValue("name", prices[index].name);
		setValue("price", prices[index].price);
		setValue("special_price", prices[index].special_price);
		setValue("start", makeDateFormat(prices[index].special_price_start, "str"));
		setValue("end", makeDateFormat(prices[index].special_price_end, "str"));
	};

	/**
	 * * Naplnění formuláře při kliknutí na event
	 * @param id: id převzaté z info dostupného v rámci objektu eventu
	 */
	const fillFromEvent = (id) => {
		let i = prices.findIndex((el) => el.id === Number(id));
		setSelected(prices[i].name);
		setValue("id", prices[i].id);
		setValue("name", prices[i].name);
		setValue("price", prices[i].price);
		setValue("special_price", prices[i].special_price);
		setValue("start", makeDateFormat(prices[i].special_price_start, "str"));
		setValue("end", makeDateFormat(prices[i].special_price_end, "str"));
	};

	/**
	 * * Zobrazení konteineru pro editaci položky ceníku
	 */
	const editRolesCont = () => {
		const cont = document.querySelector(`.${css.edit_price}`);
		if (showEditCont) {
			cont.classList.remove(css.show_roles_edit);
			setSelected("choose");
			reset();
		} else {
			cont.classList.add(css.show_roles_edit);
		}

		setShowEditCont(!showEditCont);
	};

	/**
	 * * Vybere vhodnou ikonu podle aktuálnosti akční ceny
	 * @param {int} start: začátek akce
	 * @param {int} end: konec akce
	 * @returns navrací ikonu podle aktuálnosti akce
	 */
	const isActive = (start, end) => {
		if (start == 0 || end == 0) {
			return <FontAwesomeIcon id={css.status_icon} icon={faMinus} onClick={editRolesCont} style={{ color: "gray" }} title="Nedostupné" />;
		}

		if (dateNow >= start && dateNow <= end) {
			return <FontAwesomeIcon id={css.status_icon} icon={faCircleCheck} onClick={editRolesCont} style={{ color: "var(--green)" }} title="Aktivní" />;
		}

		return <FontAwesomeIcon id={css.status_icon} icon={faClockRotateLeft} onClick={editRolesCont} style={{ color: "orange" }} title="Neaktivní" />;
	};

	/**
	 * * Handler pro onclick eventu
	 * @param {object} info: objekt obsahující veškerá data eventu
	 */
	const eventHandler = (info) => {
		window.scrollTo(0, 0);
		editRolesCont();
		fillFromEvent(info.event.id);
	};

	/**
	 * * Zobrazuje nebo skryje formulář pro vytvoření nové položky
	 */

	const addItemCont = () => {
		const cont = document.querySelector(`.${css.add_item}`);
		if (showAddItemCont) {
			cont.classList.remove(css.show_add_item);
			resetCreateForm();
		} else {
			cont.classList.add(css.show_add_item);
		}

		setShowAddItemCont(!showAddItemCont);
	};

	return (
		<div className={css.pricelist}>
			<section>
				<h2>Seznam položek ceníku</h2>
				<table>
					<thead>
						<tr>
							<th>Položka</th>
							<th>Cena</th>
							<th>Akční cena</th>
							<th>Aktivní akce</th>
						</tr>
					</thead>
					<tbody>
						{prices &&
							prices.map((item) => (
								<tr key={item.id}>
									<td>{item.name}</td>
									<td>{item.price} Kč</td>
									<td>{item.special_price} Kč</td>
									<td>{isActive(item.special_price_start, item.special_price_end)}</td>
								</tr>
							))}
					</tbody>
				</table>
				<button id={css.addItem} onClick={addItemCont}>
					+
				</button>
				<button onClick={editRolesCont}>Upravit položky</button>
				{/* // * Formulář pro editaci položek ceníku (class EDIT_PRICE) */}
				<div className={css.edit_price}>
					<FontAwesomeIcon id={css.close} icon={faXmark} onClick={editRolesCont} />
					<form onSubmit={handleSubmit(onSubmit)}>
						<h2>Úprava položky</h2>
						<div className={cssBasic.input_box_comment}>
							<select onChange={handleChange} value={selected}>
								<option value="choose">--- Vyberte položku ---</option>
								{prices &&
									prices.map((item) => (
										<option key={item.id} value={item.name}>
											{item.name}
										</option>
									))}
							</select>
							<span>Název položky</span>
						</div>
						<div className={cssBasic.input_box_comment}>
							<input type="text" {...register("name")} required />
							<div>
								<label>Název položky</label>
							</div>
						</div>

						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="text" {...register("price")} required />
							<div>
								<label>Cena</label>
							</div>
						</div>

						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="text" {...register("special_price")} required />
							<div>
								<label>Akční cena</label>
							</div>
						</div>

						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="date" {...register("start")} />
							<div>
								<label>Začátek akční ceny</label>
							</div>
						</div>

						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="date" {...register("end")} />
							<div>
								<label>Konec akční ceny</label>
							</div>
						</div>
						<input type="hidden" {...register("id")} />
						<button type="submit">Uložit</button>
					</form>
				</div>
				{/* // * Formulář pro vytváření nových položek (class ADD_ITEM) */}
				<div className={css.add_item}>
					<FontAwesomeIcon id={css.close} icon={faXmark} onClick={addItemCont} />
					<form onSubmit={handleSubmitCreate(onSubmitCreate)}>
						<h2>Nová položka</h2>
						<div className={cssBasic.input_box_comment}>
							<input type="text" {...registerCreate("name")} required />
							<div>
								<label>Název položky</label>
							</div>
						</div>

						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="text" {...registerCreate("price")} required />
							<div>
								<label>Cena</label>
							</div>
						</div>

						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="text" {...registerCreate("special_price")} required />
							<div>
								<label>Akční cena</label>
							</div>
						</div>

						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="date" {...registerCreate("start")} />
							<div>
								<label>Začátek akční ceny</label>
							</div>
						</div>

						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="date" {...registerCreate("end")} />
							<div>
								<label>Konec akční ceny</label>
							</div>
						</div>
						<button type="submit">Uložit</button>
					</form>
				</div>
			</section>
			{/* // * SEKCE KALENDÁŘE */}
			<section className={css.calendar}>
				<FullCalendar plugins={[dayGridPlugin]} events={events} locale="cs" timeZone="local" firstDay="1" initialView="dayGridMonth" buttonText={{ today: "Dnes" }} height="auto" eventBorderColor="transparent" eventClick={eventHandler}></FullCalendar>
			</section>
			{alert && <Alert action={alert.action} text={alert.text} timeout={alert.timeout} setAlert={setAlert} />}
		</div>
	);
};

export default Pricelist;
