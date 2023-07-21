import { useEffect, useState, useRef } from "react";
import TextEditor from "../../Components/admin/TextEditor";
import { formatBody, checkInnerImage, findDeletedImages } from "../../modules/TextEditorFunctions";

import { useForm } from "react-hook-form";

import { faCalendarDays, faEye, faHashtag, faHeading, faImage, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { convertBase64, makeDateFormat, openImage, publicPath } from "../../modules/BasicFunctions";
import { get, create, edit, remove } from "../../modules/ApiFunctions";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import cssBasic from "../styles/Basic.module.css";
import css from "./Article.module.css";
import ImageList from "./ImageList";
import { getCategories } from "../../modules/ApiCategories";

const Article = () => {
	const auth = useAuth();

	const { setMessage, setAlert } = useInteraction();

	const { id } = useParams();
	const [article, setArticle] = useState(null);
	const [categories, setCategories] = useState(null);

	const { register, handleSubmit, setValue, reset } = useForm();
	const [imageIsSet, setImageIsSet] = useState(false);

	const [body, setBody] = useState("");
	const [underArticleImages, setUnderArticleImages] = useState(null);

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
			setArticle(null);
			setUnderArticleImages(null);
		}
		getCategories(setCategories, "articles");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	async function getData() {
		const data = await get("articles", id);
		setArticle(data);
		setValue("title", data.title);
		setValue("description", data.description);
		setValue("date", makeDateFormat(data.date, "str"));
		setValue("active", data.active);
		setValue("category", data.category);
		setBody(data.body);
		originalImages.current = checkInnerImage(data.body);
		setImageIsSet(true);
		setUnderArticleImages(data.images.length === 0 ? null : data.images);
	}

	const onSubmit = async (data) => {
		data.date = makeDateFormat(data.date);
		data.body = await formatBody(body, arrayInsideImages, "articles");
		if (data.image[0]) {
			const base64 = await convertBase64(data.image[0]);
			data.image = base64;
			if (article) {
				data.prevImage = article.image;
			}
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
		data.deletedImages = findDeletedImages(body, originalImages);

		if (article) {
			data.id = article.id;
			edit("articles", data, setMessage, "Článek byl upraven", auth);
		} else {
			await create("articles", data, setMessage, "Článek byl vytvořen", auth);
			navigation("/dashboard/articles");
		}
	};

	const removeHandler = () => {
		remove("articles", article.id, setMessage, "Článek byl smazán", auth);
	};

	const removeArticle = () => {
		setAlert({ id: id, question: "Smazat článek?", positiveHandler: removeHandler });
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={css.article}>
			<section>
				<h2>Základní informace</h2>
				<div className={cssBasic.input_box}>
					<input type="text" placeholder="Titulek" {...register("title")} required />
					<FontAwesomeIcon className={cssBasic.icon} icon={faHeading} />
				</div>
				<div className={cssBasic.input_box}>
					<input type="text" placeholder="Popisek" {...register("description")} />
					<FontAwesomeIcon className={cssBasic.icon} icon={faMagnifyingGlass} />
				</div>
				<p>Článek je viditelný: </p>
				<label className="switch">
					<input type="checkbox" {...register("active")} />
					<span className="slider"></span>
				</label>
			</section>

			<section>
				<h2>Doplňující informace</h2>
				<div className={cssBasic.input_box} title="Datum zveřejnění">
					<input type="date" {...register("date")} autoComplete="new-password" required />
					<FontAwesomeIcon className={cssBasic.icon} icon={faCalendarDays} />
				</div>
				<div className={cssBasic.input_box}>
					<select defaultValue={"default"} {...register("category")}>
						<option value="default" disabled>
							-- Kategorie článku --
						</option>
						{categories &&
							categories.map((el) => (
								<option key={`category-${el.name}`} value={el.id}>
									{el.name}
								</option>
							))}
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
						<input type="file" {...register("image")} accept="image/*" required />
					)}

					<FontAwesomeIcon className={cssBasic.icon} icon={faImage} />
				</div>
			</section>

			<section>
				<h2>Text článku</h2>
				<TextEditor value={body} setValue={setBody} />

				<div>
					<h2>Obrázky pod článkem:</h2>
					<h3>Přidat obrázky:</h3>
					<div className={`${cssBasic.input_box}`}>
						<input type="file" accept="image/*" {...register("images")} multiple />
						<FontAwesomeIcon className={cssBasic.icon} icon={faImage} />
					</div>

					{underArticleImages && (
						<ImageList images={underArticleImages} auth={auth} setMessage={setMessage} setImages={setUnderArticleImages} location="articles" />
					)}
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
