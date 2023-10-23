import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextEditor from "../../Components/admin/TextEditor";
import InputBox from "../../Components/basic/InputBox";
import { checkInnerImage, findDeletedImages, formatBody } from "../../modules/TextEditorFunctions";
import { faEye, faHashtag, faHeading, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { create, edit, get, remove } from "../../modules/ApiFunctions";
import { convertBase64, makeDateFormat } from "../../modules/BasicFunctions";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DatePicker from "../../Components/basic/DatePicker";
import ImageInput from "../../Components/basic/image-input/ImageInput";
import Select from "../../Components/basic/select/Select";
import Switch from "../../Components/basic/switch/Switch";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { getCategories } from "../../modules/ApiCategories";
import cssBasic from "../styles/Basic.module.css";
import css from "./Article.module.css";
import ImagesUnderArticle from "./ImagesUnderArticle";

//TODO dodělat náhled článku
export default function Article() {
	const auth = useAuth();
	const { setMessage, setAlert } = useInteraction();

	const { id } = useParams();
	const { register, handleSubmit, setValue, reset } = useForm();

	const [article, setArticle] = useState(null);
	const [categories, setCategories] = useState(null);
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
		setUnderArticleImages(data.images.length === 0 ? null : data.images);
	}

	async function onSubmit(data) {
		data.date = makeDateFormat(data.date);
		data.body = await formatBody(body, arrayInsideImages, "articles");

		if (data.body === "") {
			setMessage({ action: "alert", text: "Vyplňte text článku" });
			return;
		}

		data.active = data.active ? 1 : 0;
		if (data.image?.[0]) {
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
			await edit("articles", data, setMessage, "Článek byl upraven", auth);
			getData();
		} else {
			await create("articles", data, setMessage, "Článek byl vytvořen", auth);
			navigation("/articles");
		}
		reset();
	}

	async function removeHandler() {
		await remove("articles", article.id, setMessage, "Článek byl smazán", auth);
		navigation("/articles");
	}

	async function removeArticle() {
		setAlert({ id: id, question: "Smazat článek?", positiveHandler: removeHandler });
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={css.article}>
			<section>
				<h2>Základní informace</h2>
				<InputBox type="text" name="title" placeholder="Titulek" register={register} icon={faHeading} isRequired={true} />
				<InputBox type="text" name="description" placeholder="Popisek" register={register} icon={faMagnifyingGlass} isRequired={true} />
				<Switch name="active" label="Článek je viditelný:" register={register} />
			</section>

			<section>
				<h2>Doplňující informace</h2>
				<DatePicker name="date" placeholder="Datum zveřejnění" register={register} additionalClasses="gray" isRequired={true} />
				<Select name="category" options={categories} register={register} icon={faHashtag} placeholderValue="-- Kategorie článku --" />
				<ImageInput image={article?.image} name="image" path="articles" register={register} />
			</section>

			<section>
				<h2>Text článku</h2>
				<TextEditor value={body} setValue={setBody} />
				<ImagesUnderArticle
					register={register}
					underArticleImages={underArticleImages}
					setUnderArticleImages={setUnderArticleImages}
					location="articles"
				/>

				<div className={css.control_box}>
					<button>Uložit</button>
					{/* <button type="button" className={css.btn_preview}>
						<FontAwesomeIcon className={css.btn_icon} icon={faEye} />
						Náhled článku
					</button> */}
					{article && (
						<button type="button" className={cssBasic.btn_delete} onClick={removeArticle}>
							Smazat
						</button>
					)}
				</div>
			</section>
		</form>
	);
}
