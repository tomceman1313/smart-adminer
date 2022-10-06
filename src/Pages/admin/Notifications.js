import { useEffect, useState } from "react";
import css from "./styles/Notifications.module.css";
import cssBasic from "./styles/Basic.module.css";

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Alert from "../Components/admin/Alert";

import { isActive, makeDateFormat } from "../modules/BasicFunctions";
import { useForm } from "react-hook-form";
import CheckMessage from "../Components/admin/CheckMessage";

const Notifications = () => {
	// array všech notifikací
	const [notifications, setNotifications] = useState(null);

	const { register: registerUpdate, handleSubmit: handleSubmitUpdate, setValue, reset, getValues } = useForm();
	const { register: registerCreate, handleSubmit: handleSubmitCreate, reset: resetCreateForm } = useForm();

	// ukazatel pro zobrazení Alert componentu
	const [alert, setAlert] = useState(null);

	// ukazatel pro zobrazení Alert componentu
	const [check, setCheck] = useState(null);

	// title aktuálně zvolené notifikace, která byla vybrána v selectu
	const [selected, setSelected] = useState("");

	// true / false pro zobrazení formulářů
	const [showEditCont, setShowEditCont] = useState(false);
	const [showAddItemCont, setShowAddItemCont] = useState(false);

	useEffect(() => {
		getData();
		document.getElementById("banner-title").innerHTML = "Upozornění";
		document.getElementById("banner-desc").innerHTML = "Informujte své návštěvníky o mimořádných událostech";
	}, []);

	const getData = () => {
		fetch("http://localhost:4300/api?class=notifications&action=getall").then((response) => {
			response.text().then((_data) => {
				const data = JSON.parse(_data);
				setNotifications(data);
				console.log(data);
			});
		});
	};

	/**
	 * * POST
	 * ? Funkce pro submit formuláře pro editaci položek ceníku
	 * @param {object} data
	 */
	const onSubmit = (data) => {
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);
		if (data.start > data.end) {
			setAlert({ action: "alert", text: "Datum začátku a konce akční ceny je zadáno nesprávně", timeout: 6000 });
			return;
		}

		fetch("http://localhost:4300/api?class=notifications&action=update", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})
			.then((response) => {
				if (response.status === 200) {
					setAlert({ action: "success", text: "Uloženo", timeout: 6000 });
					edit();
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
	 * ? Funkce pro submit formuláře pro vytvoření položek ceníku
	 * @param {object} data
	 */
	const onSubmitCreate = (data) => {
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);
		if (data.start > data.end) {
			setAlert({ action: "alert", text: "Datum začátku a konce akční ceny je zadáno nesprávně", timeout: 6000 });
			return;
		}

		fetch("http://localhost:4300/api?class=notifications&action=create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})
			.then((response) => {
				if (response.status === 201) {
					setAlert({ action: "success", text: "Uloženo", timeout: 6000 });
					add();
					getData();
				} else {
					setAlert({ action: "failure", text: "Vytvoření položky nebylo provedeno", timeout: 6000 });
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
		let index = notifications.findIndex((el) => el.title == e.target.value);
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
	const edit = () => {
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

	const add = () => {
		const cont = document.querySelector(`.${css.add_notification}`);
		if (showAddItemCont) {
			cont.classList.remove(css.show_add_notification);
			resetCreateForm();
		} else {
			cont.classList.add(css.show_add_notification);
		}
		setShowAddItemCont(!showAddItemCont);
	};

	/**
	 * * DELETE request na api
	 * ? Po potvrzení CheckMessage je volána tato funkce, která zajistí odstranění zvolené položky
	 * @param {int} id
	 */
	const remove = (id) => {
		const idJson = { id: id };
		fetch("http://localhost:4300/api?class=notifications&action=delete", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(idJson),
		})
			.then((response) => {
				if (response.status === 200) {
					setAlert({ action: "success", text: "Uloženo", timeout: 6000 });
					add();
					getData();
				} else {
					setAlert({ action: "failure", text: "Vytvoření položky nebylo provedeno", timeout: 6000 });
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
	 * * Click Handler pro smazání notifikace
	 * ? Vyvolá CheckMessage
	 */
	const deleteNotification = () => {
		const id = getValues("id");
		setCheck({ id: id, question: "Smazat notifikaci?" });
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
		edit();
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
									<td>{isActive(item.start, item.end, edit, css)}</td>
								</tr>
							))}
					</tbody>
				</table>
				<button id={css.addItem} onClick={add}>
					+
				</button>
				<button onClick={edit}>Upravit položky</button>
				{/* // * Formulář pro editaci položek ceníku (class EDIT_PRICE) */}
				<div className={css.edit_notification}>
					<FontAwesomeIcon id={css.close} icon={faXmark} onClick={edit} />
					<form onSubmit={handleSubmitUpdate(onSubmit)}>
						<h2>Úprava upozornění</h2>
						<div className={cssBasic.input_box_comment}>
							<select onChange={handleChange} value={selected}>
								<option value="choose">--- Vyberte notifikaci ---</option>
								{notifications &&
									notifications.map((item) => (
										<option key={item.id} value={item.title}>
											{item.path}
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
					<FontAwesomeIcon id={css.close} icon={faXmark} onClick={add} />
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
			{alert && <Alert action={alert.action} text={alert.text} timeout={alert.timeout} setAlert={setAlert} />}
			{check && <CheckMessage id={check.id} question={check.question} positiveHandler={remove} setCheck={setCheck} />}
		</div>
	);
};

export default Notifications;
