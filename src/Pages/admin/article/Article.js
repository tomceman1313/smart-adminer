import { useEffect, useState } from "react";
import TextEditor from "../../Components/admin/TextEditor";

import { useForm } from "react-hook-form";

import { faCalendarDays, faEye, faHashtag, faHeading, faImage, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { makeDateFormat, openImage } from "../../modules/BasicFunctions";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import cssBasic from "../styles/Basic.module.css";
import css from "./Article.module.css";

/**
 * TODO změnit id vlastníka při vytváření článku
 */
const Article = () => {
	const auth = useAuth();
	const { setMessage, setAlert } = useInteraction();

	const { id } = useParams();
	const [article, setArticle] = useState(null);

	const { register, handleSubmit, setValue, reset } = useForm();
	const [imageIsSet, setImageIsSet] = useState(false);

	const [body, setBody] = useState("");

	const navigation = useNavigate();
	let location = useLocation();

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Články";
		document.getElementById("banner-desc").innerHTML = "Tvořte a spravujte vlastní články";
		if (id) {
			getData();
		} else {
			reset();
			setBody("");
			setImageIsSet(false);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	function getData() {
		fetch("http://localhost:4300/api?class=articles&action=get", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			body: JSON.stringify({ id: id, token: auth.userInfo.token }),
			credentials: "include",
		}).then((response) => {
			if (response.status === 403) {
				navigation("/login");
			}

			response.text().then((_data) => {
				const data = JSON.parse(_data);
				setArticle(data.data);
				setValue("title", data.data.title);
				setValue("description", data.data.description);
				setValue("date", makeDateFormat(data.data.date, "str"));
				setValue("active", data.data.active);
				setBody(data.data.body);
				setImageIsSet(true);

				fetch("http://localhost:4300/api?class=articles&action=category", {
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
					body: JSON.stringify({ id: data.data.category, token: auth.userInfo.token }),
				}).then((response) => {
					response.text().then((_data) => {
						const data = JSON.parse(_data);
						setValue("category", data.data.id);
					});
				});
			});
		});
	}

	const convertBase64 = (file) => {
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
	};

	const onSubmit = async (data) => {
		data.date = makeDateFormat(data.date);
		data.body = body;
		if (data.image[0]) {
			const base64 = await convertBase64(data.image[0]);
			data.image = base64;
		} else {
			data.image = "no-change";
		}
		data.owner_id = "1"; // Změnit ID až bude login
		let url = "http://localhost:4300/api?class=articles&action=create";
		if (article) {
			data.id = article.id;
			url = "http://localhost:4300/api?class=articles&action=update";
		}
		fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			body: JSON.stringify({ data: data, token: auth.userInfo.token }),
			credentials: "include",
		})
			.then((response) => {
				if (response.status === 200 || response.status === 201) {
					setMessage({ action: "success", text: "Uloženo", timeout: 6000 });
				} else {
					setMessage({ action: "failure", text: "Operace selhala", timeout: 6000 });
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

	const remove = () => {
		const idJson = { id: article.id, token: auth.userInfo.token };
		fetch("http://localhost:4300/api?class=articles&action=delete", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			body: JSON.stringify(idJson),
			credentials: "include",
		})
			.then((response) => {
				if (response.status === 200) {
					navigation("/dashboard/articles");
				} else {
					setMessage({ action: "failure", text: "Smazání položky nebylo provedeno", timeout: 6000 });
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

	const deleteArticle = () => {
		setAlert({ id: id, question: "Smazat článek?", positiveHandler: remove });
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
				<p>Článek je viditelný: </p>
				<label className={css.switch}>
					<input type="checkbox" {...register("active")} />
					<span className={css.slider}></span>
				</label>
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
						<option value="1">Novinky</option>
						<option value="2">Politika</option>
						<option value="3">Sport</option>
					</select>
					<FontAwesomeIcon className={cssBasic.icon} icon={faHashtag} />
				</div>

				<div className={cssBasic.input_box} title="">
					{imageIsSet ? (
						<div className={cssBasic.image_box}>
							<button type="button" onClick={() => openImage(`/images/articles/${article.image}`)}>
								Zobrazit obrázek
							</button>
							<button type="button" onClick={() => setImageIsSet(false)}>
								Změnit obrázek
							</button>
						</div>
					) : (
						<input type="file" {...register("image")} accept="image/*" />
					)}

					<FontAwesomeIcon className={cssBasic.icon} icon={faImage} />
				</div>
			</section>

			<section>
				<h2>Text článku</h2>
				<TextEditor value={body} setValue={setBody} />
				<div className={css.control_box}>
					<button>Uložit</button>
					<button type="button" className={css.btn_preview}>
						<FontAwesomeIcon className={css.btn_icon} icon={faEye} />
						Náhled článku
					</button>
					{article && (
						<button type="button" className={cssBasic.btn_delete} onClick={deleteArticle}>
							Smazat
						</button>
					)}
				</div>
			</section>
		</form>
	);
};

export default Article;
