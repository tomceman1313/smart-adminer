import { faHashtag, faHeading, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TextEditor from "../../Components/admin/TextEditor";
import DatePicker from "../../Components/basic/DatePicker";
import InputBox from "../../Components/basic/InputBox";
import ImageInput from "../../Components/basic/image-input/ImageInput";
import Select from "../../Components/basic/select/Select";
import Switch from "../../Components/basic/switch/Switch";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { getCategories } from "../../modules/ApiCategories";
import { create, edit, get, remove } from "../../modules/ApiFunctions";
import { convertBase64, makeDateFormat } from "../../modules/BasicFunctions";
import { checkInnerImage, findDeletedImages, formatBody, removeEmptyParagraphs } from "../../modules/TextEditorFunctions";
import ImagesUnderArticle from "../article/ImagesUnderArticle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import ArticlePreview from "../../Components/common/article-preview/ArticlePreview";
import { Helmet } from "react-helmet-async";
import css from "../article/Article.module.css";
import cssBasic from "../styles/Basic.module.css";

export default function Event() {
	const auth = useAuth();
	const { setMessage, setAlert } = useInteraction();

	const { id } = useParams();
	const { register, handleSubmit, setValue, getValues, reset } = useForm();

	const [event, setEvent] = useState(null);
	const [eventPreview, setEventPreview] = useState(null);
	const [categories, setCategories] = useState(null);
	const [body, setBody] = useState(null);
	const [underEventImages, setUnderEventImages] = useState(null);

	const navigation = useNavigate();
	let location = useLocation();

	let arrayInsideImages = [];
	const originalImages = useRef([]);

	useEffect(() => {
		if (id) {
			loadData();
		} else {
			reset();
			setBody("");
			setEvent(null);
			setUnderEventImages(null);
		}
		getCategories(setCategories, "events");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	async function loadData() {
		const data = await get("events", id);
		setEvent(data);
		setValue("title", data.title);
		setValue("description", data.description);
		setValue("date", makeDateFormat(data.date, "str"));
		setValue("active", data.active);
		setValue("category", data.category);
		setBody(data.body);
		originalImages.current = checkInnerImage(data.body);
		setUnderEventImages(data.images.length === 0 ? null : data.images);
	}

	const onSubmit = async (data) => {
		data.date = makeDateFormat(data.date);
		data.body = await formatBody(body, arrayInsideImages, "events");

		if (data.body === "") {
			setMessage({ action: "alert", text: "Vyplňte text události" });
			return;
		}

		data.active = data.active ? 1 : 0;
		if (data.image?.[0]) {
			const base64 = await convertBase64(data.image[0]);
			data.image = base64;
			if (event) {
				data.prevImage = event.image;
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

		if (event) {
			data.id = event.id;
			await edit("events", data, setMessage, "Událost byla upravena", auth);
			loadData();
		} else {
			await create("events", data, setMessage, "Událost byla upravena", auth);
			navigation("/events");
		}
		reset();
	};

	async function removeHandler() {
		await remove("events", event.id, setMessage, "Událost byla odstraněna", auth);
		navigation("/events");
	}

	const removeArticle = () => {
		setAlert({ id: id, question: "Smazat událost?", positiveHandler: removeHandler });
	};

	async function openArticlePreview() {
		let data = getValues();
		data.date = makeDateFormat(data.date);
		if (data.image?.[0]) {
			const base64 = await convertBase64(data.image[0]);
			data.image = base64;
		} else {
			data.image = event ? event.image : null;
		}

		let imagesArray = [];
		for (const file of data.images) {
			const base64 = await convertBase64(file);
			imagesArray.push(base64);
		}
		data.images = event ? event.images.concat(imagesArray) : imagesArray;
		data.body = removeEmptyParagraphs(body);
		setEventPreview(data);
	}

	return (
		<>
			<Helmet>
				<title>{event?.title ? event.title : "Nová událost"} | SmartAdminer</title>
			</Helmet>
			{categories ? (
				<form onSubmit={handleSubmit(onSubmit)} className={css.article}>
					<section>
						<h2>Základní informace</h2>
						<InputBox type="text" name="title" placeholder="Titulek" register={register} icon={faHeading} isRequired={true} />
						<InputBox type="text" name="description" placeholder="Popisek" register={register} icon={faMagnifyingGlass} />
						<Switch name="active" label="Událost je viditelná:" register={register} />
					</section>

					<section>
						<h2>Doplňující informace</h2>
						<DatePicker name="date" placeholder="Datum zveřejnění" register={register} additionalClasses="gray" />
						<Select
							name="category"
							options={categories}
							register={register}
							icon={faHashtag}
							placeholderValue="-- Kategorie události --"
							defaultValue={event?.category}
						/>
						<ImageInput image={event?.image} name="image" path="events" register={register} />
					</section>

					<section>
						<h2>Text události</h2>
						{body !== null && <TextEditor value={body} setValue={setBody} />}
						<ImagesUnderArticle
							register={register}
							underArticleImages={underEventImages}
							setUnderArticleImages={setUnderEventImages}
							location="events"
						/>

						<div className={css.control_box}>
							<button>Uložit</button>
							<button type="button" className={css.btn_preview} onClick={openArticlePreview}>
								<FontAwesomeIcon className={css.btn_icon} icon={faEye} />
								Náhled události
							</button>
							{event && (
								<button type="button" className={cssBasic.btn_delete} onClick={removeArticle}>
									Smazat
								</button>
							)}
						</div>
					</section>
				</form>
			) : (
				<h3>Načítání události</h3>
			)}
			<ArticlePreview article={eventPreview} close={() => setEventPreview(null)} typeOfPreview="events" />
		</>
	);
}
