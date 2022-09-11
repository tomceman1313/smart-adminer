import React, { useEffect, useState } from "react";
import css from "./styles/Pricelist.module.css";
import cssBasic from "./styles/Basic.module.css";

import { useForm } from "react-hook-form";
import { makeDate, makeDateFormat } from "../modules/BasicFunctions";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faIdBadge, faImagePortrait, faMobileScreen, faAt, faUnlock, faArrowUpWideShort, faAddressBook, faBolt, faXmark } from "@fortawesome/free-solid-svg-icons";

const Pricelist = () => {
	const [prices, setPrices] = useState(null);
	const [showEditCont, setShowEditCont] = useState(false);

	const date = new Date();
	const dateNow = Number(makeDate(date.getFullYear(), date.getMonth() + 1, date.getDate()));

	const { register: register, handleSubmit: handleSubmit, setValue } = useForm();

	useEffect(() => {
		fetch("http://localhost:4300/api?class=pricelist&action=getall").then((response) => {
			response.text().then((_data) => {
				const data = JSON.parse(_data);
				console.log(data);
				setPrices(data);
				isActive();
			});
		});
	}, []);

	const editRoles = () => {
		const cont = document.querySelector(`.${css.edit_price}`);
		if (showEditCont) {
			cont.classList.remove(css.show_roles_edit);
		} else {
			cont.classList.add(css.show_roles_edit);
		}

		setValue("id", prices[0].id);
		setValue("name", prices[0].name);
		setValue("price", prices[0].price);
		setValue("special_price", prices[0].special_price);
		setValue("start", makeDateFormat(prices[0].special_price_start, "str"));
		setValue("end", makeDateFormat(prices[0].special_price_end, "str"));

		setShowEditCont(!showEditCont);
	};

	const isActive = (start, end) => {
		if (start == 0 || end == 0) {
			return "nezadáno";
		}

		if (dateNow >= start && dateNow <= end) {
			return "aktivní";
		}

		return "neaktivní";
	};

	const onSubmit = (data) => {
		data.start = makeDateFormat(data.start);
		data.end = makeDateFormat(data.end);
		console.log(JSON.stringify(data));
		fetch("http://localhost:4300/api?class=pricelist&action=update", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})
			.then((response) => {
				response.text().then((_data) => {
					let data = JSON.parse(_data);
					console.log(data);
				});
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return;
			})
			.catch((error) => {
				console.error("There has been a problem with your fetch operation:", error);
			});
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
									<td>{item.price}</td>
									<td>{item.special_price}</td>
									<td>{isActive(item.special_price_start, item.special_price_end)}</td>
								</tr>
							))}
					</tbody>
				</table>

				<button onClick={editRoles}>Změnit práva</button>

				<div className={css.edit_price}>
					<FontAwesomeIcon id={css.close} icon={faXmark} onClick={editRoles} />
					<form onSubmit={handleSubmit(onSubmit)}>
						<h2>Úprava položky</h2>
						<div className={cssBasic.input_box_comment}>
							<input type="text" {...register("name")} required />
							<div>
								<label>Název položky</label>
							</div>
						</div>

						<div className={cssBasic.input_box_comment}>
							<input type="text" {...register("price")} required />
							<div>
								<label>Cena</label>
							</div>
						</div>

						<div className={cssBasic.input_box_comment}>
							<input type="text" {...register("special_price")} required />
							<div>
								<label>Akční cena</label>
							</div>
						</div>

						<div className={cssBasic.input_box_comment}>
							<input type="date" {...register("start")} required />
							<div>
								<label>Začátek akční ceny</label>
							</div>
						</div>

						<div className={cssBasic.input_box_comment}>
							<input type="date" {...register("end")} required />
							<div>
								<label>Konec akční ceny</label>
							</div>
						</div>
						<input type="hidden" {...register("id")} />
						<button type="submit">Uložit</button>
					</form>
				</div>
			</section>
		</div>
	);
};

export default Pricelist;
