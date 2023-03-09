import { useEffect, useState, useRef } from "react";
import TextEditor from "../../Components/admin/TextEditor";

import { useForm } from "react-hook-form";

import { faCalendarDays, faEye, faHashtag, faHeading, faImage, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { createArticle, deleteArticle, getArticle, updateArticle } from "../../modules/ApiArticles";
import { convertBase64, makeDateFormat, openImage, publicPath } from "../../modules/BasicFunctions";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import cssBasic from "../styles/Basic.module.css";
import css from "./Article.module.css";

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

	let arrayInsideImages = [];
	const originalImages = useRef([]);

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

	async function getData() {
		const data = await getArticle(id, auth.userInfo.token, navigation);
		setArticle(data.data);
		console.log(data.data);
		setValue("title", data.data.title);
		setValue("description", data.data.description);
		setValue("date", makeDateFormat(data.data.date, "str"));
		setValue("active", data.data.active);
		setValue("category", data.data.category);
		setBody(data.data.body);
		originalImages.current = checkInnerImage(data.data.body);
		setImageIsSet(true);
	}

	const onSubmit = async (data) => {
		data.date = makeDateFormat(data.date);
		data.body = await formatBody();
		if (data.image[0]) {
			const base64 = await convertBase64(data.image[0]);
			data.image = base64;
		} else {
			data.image = "no-change";
		}

		let imagesArray = [];
		for (const file of data.images) {
			const base64 = await convertBase64(file);
			imagesArray.push(base64);
		}
		data.images = imagesArray;
		data.innerImages = arrayInsideImages;
		data.owner_id = auth.userInfo.id;
		data.deletedImages = findDeletedImages();
		console.log(data);
		if (article) {
			data.id = article.id;
			updateArticle(data, auth, setMessage);
		} else {
			console.log(data);
			createArticle(data, auth, setMessage);
		}
	};

	const remove = () => {
		deleteArticle(article.id, auth, setMessage, navigation);
	};

	const removeArticle = () => {
		setAlert({ id: id, question: "Smazat článek?", positiveHandler: remove });
	};

	const formatBody = async () => {
		let bodyContent = body;
		while (bodyContent.indexOf('src="data') > 0) {
			bodyContent = await replaceSrcByRelativePath(bodyContent);
		}
		return bodyContent;
	};

	async function replaceSrcByRelativePath(bodyContent) {
		const start = bodyContent.indexOf('src="data');
		let end;
		for (var i = start; i < bodyContent.length; i++) {
			if (bodyContent[i] === '"' && bodyContent[i + 1] === ">") {
				end = i;
				const id = parseInt(Date.now() + Math.random());
				const sliced = bodyContent.slice(start + 5, end);
				const strStart = bodyContent.substring(0, start + 5);
				const strEnd = bodyContent.substring(end);
				const fileFormat = await getImageFormat(sliced);
				let imgSrc = `${publicPath}/images/articles/innerimage${id}.${fileFormat}`;
				let str = strStart + imgSrc + strEnd;
				arrayInsideImages.push({ name: `innerimage${id}`, file: sliced });
				return str;
			}
		}
	}

	const checkInnerImage = (sourceString) => {
		const regex = /innerimage\d*.\w*/g;
		const found = sourceString.match(regex);
		return found ? found : [];
	};

	const findDeletedImages = () => {
		const bodyImages = checkInnerImage(body);
		if (originalImages.current.length !== bodyImages.length) {
			return originalImages.current.filter((el) => {
				if (!bodyImages.includes(el)) {
					return el;
				}
			});
		}
	};

	const getImageFormat = async (str) => {
		const start = str.indexOf("image/") + 6;
		for (var i = start; i < 30; i++) {
			if (str[i] === ";") {
				return str.slice(start, i);
			}
		}
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
							<button type="button" onClick={() => openImage(`${publicPath}/images/articles/${article.image}`)}>
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

				<div>
					<h2>Obrázky pod článkem:</h2>
					<div className={`${cssBasic.input_box}`}>
						<input type="file" accept="image/*" {...register("images")} multiple />
						<FontAwesomeIcon className={cssBasic.icon} icon={faImage} />
					</div>
				</div>

				<div className={css.control_box}>
					<button>Uložit</button>
					<button type="button" className={css.btn_preview}>
						<FontAwesomeIcon className={css.btn_icon} icon={faEye} />
						Náhled článku
					</button>
					{article && (
						<button type="button" className={cssBasic.btn_delete} onClick={removeArticle}>
							Smazat
						</button>
					)}
				</div>
			</section>
		</form>
	);
};

export default Article;
