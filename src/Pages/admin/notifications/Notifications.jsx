import { useEffect, useState } from "react";
import cssBasic from "../styles/Basic.module.css";
import css from "./Notifications.module.css";
import { create, remove, edit } from "../../modules/ApiFunctions";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useForm } from "react-hook-form";
import useApi from "../../Hooks/useApi";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { isActive, makeDateFormat } from "../../modules/BasicFunctions";

const Notifications = () => {
	const auth = useAuth();
	const getAll = useApi("getAll");

	const { setAlert, setMessage } = useInteraction();

	// array všech notifikací
	const [notifications, setNotifications] = useState(null);

	const { register: registerUpdate, handleSubmit: handleSubmitUpdate, setValue, reset, getValues } = useForm();
	const { register: registerCreate, handleSubmit: handleSubmitCreate, reset: resetCreateForm } = useForm();

	// title aktuálně zvolené notifikace, která byla vybrána v selectu
	const [selected, setSelected] = useState("");

	// true / false pro zobrazení formulářů
	const [showEditCont, setShowEditCont] = useState(false);
	const [showAddItemCont, setShowAddItemCont] = useState(false);

	useEffect(() => {
		getData();
		document.getElementById("banner-title").innerHTML = "Upozornění";
		document.getElementById("banner-desc").innerHTML = "Informujte své návštěvníky o mimořádných událostech";
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getData = () => {
		getAll("notifications", setNotifications, auth);
	};

	/**
	 * * POST
	 * ? Funkce pro submit formuláře pro editaci položek ceníku
	 * @param {object} data
	 */
	const onSubmit = (data) => {
		//FIXME check if path does not contain whitespace
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);
		if (data.start > data.end) {
			setMessage({ action: "alert", text: "Datum začátku a konce akční ceny je zadáno nesprávně", timeout: 6000 });
			return;
		}

		edit("notifications", data, setMessage, "Upozornění vytvořeno", auth);
		editCont();
		getData();
	};

	/**
	 * * POST
	 * ? Funkce pro submit formuláře pro vytvoření položek ceníku
	 * @param {object} data
	 */
	const onSubmitCreate = (data) => {
		//FIXME check if path does not contain whitespace
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);
		if (data.start > data.end) {
			setMessage({ action: "alert", text: "Datum začátku a konce akční ceny je zadáno nesprávně", timeout: 6000 });
			return;
		}

		create("notifications", data, setMessage, "Upozornění vytvořeno", auth);
		addCont();
		getData();
	};

	/**
	 * * DELETE request na api
	 * ? Po potvrzení CheckMessage je volána tato funkce, která zajistí odstranění zvolené položky
	 * @param {int} id
	 */
	const deleteHandler = (id) => {
		remove("notifications", id, setMessage, "Upozornění bylo odstřaněna", auth);
		editCont();
		getData();
	};

	/**
	 * * Click Handler pro smazání notifikace
	 * ? Vyvolá CheckMessage
	 */
	const deleteNotification = () => {
		const id = getValues("id");
		setAlert({ id: id, question: "Smazat notifikaci?", positiveHandler: deleteHandler });
	};

	/**
	 * * Click handler option v selectu
	 * ? Naplnění formuláře při vybrání option v selectu v rámci formuláře
	 * @param e: odkaz na element option, který byl vybrán
	 */
	const handleChange = (e) => {
		if (e.target.value === "choose") {
			document.getElementById("delete").style.opacity = "0";
			reset();
			return;
		}
		let index = notifications.findIndex((el) => el.title === e.target.value);
		setSelected(e.target.value);
		setValue("id", notifications[index].id);
		setValue("title", notifications[index].title);
		setValue("text", notifications[index].text);
		setValue("path", notifications[index].path);
		setValue("start", makeDateFormat(notifications[index].start, "str"));
		setValue("end", makeDateFormat(notifications[index].end, "str"));
		document.getElementById("delete").style.opacity = "1";
	};

	/**
	 * * Click Handler pro btn + (přidat novou notifikaci)
	 * ? Zobrazí nebo skryje formulář pro úpravu notifikace
	 */
	const editCont = () => {
		const cont = document.querySelector(`.${css.edit_notification}`);
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
	 * * Click Handler pro btn UPRAVIT POLOŽKU
	 * ? Zobrazuje nebo skryje formulář pro vytvoření nové notifikace
	 */

	const addCont = () => {
		const cont = document.querySelector(`.${css.add_notification}`);
		if (showAddItemCont) {
			cont.classList.remove(css.show_add_notification);
			resetCreateForm();
		} else {
			cont.classList.add(css.show_add_notification);
		}
		setShowAddItemCont(!showAddItemCont);
	};

	const openNotification = (id) => {
		const index = notifications.findIndex((el) => el.id === id);
		setSelected(notifications[index].title);
		setValue("id", notifications[index].id);
		setValue("title", notifications[index].title);
		setValue("text", notifications[index].text);
		setValue("path", notifications[index].path);
		setValue("start", makeDateFormat(notifications[index].start, "str"));
		setValue("end", makeDateFormat(notifications[index].end, "str"));
		document.getElementById("delete").style.opacity = "1";
		editCont();
	};

	return (
		<div className={css.notifications}>
			<section>
				<h2>Seznam upozornění</h2>
				<table>
					<thead>
						<tr>
							<th>Nadpis</th>
							<th>Text</th>
							<th>Adresa</th>
							<th>Stav</th>
						</tr>
					</thead>
					<tbody>
						{notifications &&
							notifications.map((item) => (
								<tr key={item.id} onClick={() => openNotification(item.id)}>
									<td>{item.title}</td>
									<td>{item.text}</td>
									<td>{item.path}</td>
									<td>{isActive(item.start, item.end, editCont, css)}</td>
								</tr>
							))}
					</tbody>
				</table>
				<button onClick={addCont}>+</button>
				<button className="blue_button" onClick={editCont}>
					Upravit položky
				</button>
				{/* // * Form for editing   */}
				<div className={css.edit_notification}>
					<FontAwesomeIcon id={css.close} icon={faXmark} onClick={editCont} />
					<form onSubmit={handleSubmitUpdate(onSubmit)}>
						<h2>Úprava upozornění</h2>
						<div className={cssBasic.input_box_comment}>
							<select onChange={handleChange} value={selected}>
								<option value="choose">--- Vyberte notifikaci ---</option>
								{notifications &&
									notifications.map((item) => (
										<option key={item.id} value={item.title}>
											{item.title}
										</option>
									))}
							</select>
							<span>Název notifikace</span>
						</div>
						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="text" {...registerUpdate("title")} required />
							<div>
								<label>Nadpis</label>
							</div>
						</div>

						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="text" {...registerUpdate("path")} required />
							<div>
								<label>Adresa</label>
							</div>
						</div>

						<div className={cssBasic.input_box_comment}>
							<input type="text" {...registerUpdate("text")} required />
							<div>
								<label>Text</label>
							</div>
						</div>

						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="date" {...registerUpdate("start")} />
							<div>
								<label>Počáteční datum</label>
							</div>
						</div>

						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="date" {...registerUpdate("end")} />
							<div>
								<label>Konečné datum</label>
							</div>
						</div>
						<input type="hidden" {...registerUpdate("id")} />
						<button type="submit">Uložit</button>
						<button type="button" id="delete" className={cssBasic.delete_button} onClick={deleteNotification}>
							Smazat
						</button>
					</form>
				</div>
				{/* // * Formulář pro vytváření nových položek (class ADD_NOTIFICATION) */}
				<div className={css.add_notification}>
					<FontAwesomeIcon id={css.close} icon={faXmark} onClick={addCont} />
					<form onSubmit={handleSubmitCreate(onSubmitCreate)}>
						<h2>Nová položka</h2>

						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="text" {...registerCreate("title")} required />
							<div>
								<label>Nadpis</label>
							</div>
						</div>

						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="text" {...registerCreate("path")} required />
							<div>
								<label>Adresa</label>
							</div>
						</div>

						<div className={cssBasic.input_box_comment}>
							<input type="text" {...registerCreate("text")} required />
							<div>
								<label>Text</label>
							</div>
						</div>

						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="date" {...registerCreate("start")} />
							<div>
								<label>Počáteční datum</label>
							</div>
						</div>

						<div className={`${cssBasic.input_box_comment} ${cssBasic.datepicker}`}>
							<input type="date" {...registerCreate("end")} />
							<div>
								<label>Konečné datum</label>
							</div>
						</div>
						<button type="submit">Uložit</button>
					</form>
				</div>
			</section>
		</div>
	);
};

export default Notifications;
