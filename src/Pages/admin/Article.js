import { useEffect, useState } from "react";
import TextEditor from "../Components/admin/TextEditor";
import Alert from "../Components/admin/Alert";

import { useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCalendarDays, faHeading, faMagnifyingGlass, faImage, faHashtag } from "@fortawesome/free-solid-svg-icons";

import { makeDateFormat } from "../modules/BasicFunctions";

import css from "./styles/Article.module.css";
import cssBasic from "./styles/Basic.module.css";

const Article = () => {
	const { register, handleSubmit } = useForm();
	const [alert, setAlert] = useState(null);
	const [value, setValue] = useState("");

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Články";
		document.getElementById("banner-desc").innerHTML = "Tvořte a spravujte vlastní články";
	}, []);

	const onSubmit = (data) => {
		// data.date = makeDateFormat(data.date);
		// data.body = value;
		// data.image = "imageplaceholder.png";
		// data.owner_id = "1";
		// console.log(JSON.stringify(data));
		// fetch("http://localhost:4300/api?class=articles&action=create", {
		// 	method: "POST",
		// 	headers: { "Content-Type": "application/json" },
		// 	body: JSON.stringify(data),
		// })
		// 	.then((response) => {
		// 		if (response.status === 201) {
		// 			setAlert({ action: "success", text: "Uloženo", timeout: 6000 });
		// 		} else {
		// 			setAlert({ action: "failure", text: "Vytvoření článku nebylo provedeno", timeout: 6000 });
		// 		}

		// 		if (!response.ok) {
		// 			throw new Error("Network response was not ok");
		// 		}
		// 		return;
		// 	})
		// 	.catch((error) => {
		// 		console.error("There has been a problem with your fetch operation:", error);
		// 	});
		var data1 = new FormData();
		data1.append("file", data.image);
		fetch("http://localhost:4300/api?class=articles&action=create", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: data1,
		})
			.then((response) => {
				if (response.status === 201) {
					setAlert({ action: "success", text: "Uloženo", timeout: 6000 });
				} else {
					setAlert({ action: "failure", text: "Vytvoření článku nebylo provedeno", timeout: 6000 });
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

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={css.article}>
			<section>
				<h2>Základní informace</h2>
				<div className={cssBasic.input_box}>
					<input type="text" placeholder="Titulek" {...register("title")} />
					<FontAwesomeIcon className={cssBasic.icon} icon={faHeading} />
				</div>
				<div className={cssBasic.input_box}>
					<input type="text" placeholder="Popisek" {...register("description")} />
					<FontAwesomeIcon className={cssBasic.icon} icon={faMagnifyingGlass} />
				</div>
			</section>

			<section>
				<h2>Doplňující informace</h2>
				<div className={cssBasic.input_box} title="Datum zveřejnění">
					<input type="date" {...register("date")} autoComplete="new-password" />
					<FontAwesomeIcon className={cssBasic.icon} icon={faCalendarDays} />
				</div>
				<div className={cssBasic.input_box}>
					<select defaultValue={"default"} {...register("category")}>
						<option value="default" disabled>
							-- Kategorie článku --
						</option>
						<option value="1">Uživatel</option>
						<option value="2">Zaměstnanec</option>
						<option value="3">Admin</option>
					</select>
					<FontAwesomeIcon className={cssBasic.icon} icon={faHashtag} />
				</div>

				<div className={cssBasic.input_box} title="">
					<input type="file" {...register("image")} accept="image/*" autoComplete="new-password" />
					<FontAwesomeIcon className={cssBasic.icon} icon={faImage} />
				</div>
			</section>

			<section>
				<h2>Text článku</h2>
				<TextEditor value={value} setValue={setValue} />
			</section>
			{alert && <Alert action={alert.action} text={alert.text} timeout={alert.timeout} setAlert={setAlert} />}
		</form>
	);
};

export default Article;
