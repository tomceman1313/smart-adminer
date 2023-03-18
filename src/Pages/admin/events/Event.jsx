import { useEffect, useState, useRef } from "react";
import TextEditor from "../../Components/admin/TextEditor";
import { formatBody, checkInnerImage, findDeletedImages } from "../../modules/TextEditorFunctions";

import { useForm } from "react-hook-form";

import { faCalendarDays, faEye, faHashtag, faHeading, faImage, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { createEvent, deleteEvent, getEvent, updateEvent } from "../../modules/ApiEvents";
import { convertBase64, makeDateFormat, openImage, publicPath } from "../../modules/BasicFunctions";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import cssBasic from "../styles/Basic.module.css";
import css from "../article/Article.module.css";
import ImageList from "../article/ImageList";

const Event = () => {
	const auth = useAuth();

	const { setMessage, setAlert } = useInteraction();

	const { id } = useParams();
	const [event, setEvent] = useState(null);

	const { register, handleSubmit, setValue, reset } = useForm();
	const [imageIsSet, setImageIsSet] = useState(false);

	const [body, setBody] = useState("");
	const [underEventImages, setUnderEventImages] = useState(null);

	const navigation = useNavigate();
	let location = useLocation();

	let arrayInsideImages = [];
	const originalImages = useRef([]);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Událost";
		document.getElementById("banner-desc").innerHTML = "Tvořte a spravujte proběhlé nebo teprv plánované události";
		if (id) {
			getData();
		} else {
			reset();
			setBody("");
			setImageIsSet(false);
			setEvent(null);
			setUnderEventImages(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	async function getData() {
		const data = await getEvent(id, auth.userInfo.token, navigation);
		setEvent(data.data);
		setValue("title", data.data.title);
		setValue("description", data.data.description);
		setValue("date", makeDateFormat(data.data.date, "str"));
		setValue("active", data.data.active);
		setValue("category", data.data.category);
		setBody(data.data.body);
		originalImages.current = checkInnerImage(data.data.body);
		setImageIsSet(true);
		setUnderEventImages(data.data.images.length === 0 ? null : data.data.images);
	}

	const onSubmit = async (data) => {
		data.date = makeDateFormat(data.date);
		data.body = await formatBody(body, arrayInsideImages, "events");
		if (data.image[0]) {
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
			updateEvent(data, auth, setMessage);
		} else {
			navigation("/dashboard/events", { replace: true });
			createEvent(data, auth, setMessage, navigation);
		}
	};

	const remove = () => {
		deleteEvent(event.id, auth, setMessage, navigation);
	};

	const removeArticle = () => {
		setAlert({ id: id, question: "Smazat událost?", positiveHandler: remove });
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
				<p>Událost je viditelná: </p>
				<label className={css.switch}>
					<input type="checkbox" {...register("active")} />
					<span className={css.slider}></span>
				</label>
			</section>

			<section>
				<h2>Doplňující informace</h2>
				<div className={cssBasic.input_box} title="Datum zveřejnění">
					<input type="date" {...register("date")} autoComplete="new-password" required />
					<FontAwesomeIcon className={cssBasic.icon} icon={faCalendarDays} />
				</div>
				<div className={cssBasic.input_box}>
					<select defaultValue={"default"} {...register("category")} required>
						<option value="default" disabled>
							-- Kategorie události --
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
							<button type="button" onClick={() => openImage(`${publicPath}/images/events/${event.image}`)}>
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
				<h2>Text události</h2>
				<TextEditor value={body} setValue={setBody} />

				<div>
					<h2>Obrázky pod událostí</h2>
					<h3>Přidat obrázky:</h3>
					<div className={`${cssBasic.input_box}`}>
						<input type="file" accept="image/*" {...register("images")} multiple />
						<FontAwesomeIcon className={cssBasic.icon} icon={faImage} />
					</div>

					{underEventImages && (
						<ImageList images={underEventImages} auth={auth} setMessage={setMessage} setImages={setUnderEventImages} location="events" />
					)}
				</div>

				<div className={css.control_box}>
					<button>Uložit</button>
					<button type="button" className={css.btn_preview}>
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
	);
};

export default Event;
