import { faEye, faHashtag, faHeading, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "../../components/admin/TextEditor";
import DatePicker from "../../components/basic/DatePicker";
import InputBox from "../../components/basic/InputBox";
import ImageInput from "../../components/basic/image-input/ImageInput";
import Select from "../../components/basic/select/Select";
import SubmitButton from "../../components/basic/submit-button/SubmitButton";
import Switch from "../../components/basic/switch/Switch";
import ArticlePreview from "../../components/common/article-preview/ArticlePreview";
import useApiCategories from "../../hooks/useApiCategories";
import useBasicApiFunctions from "../../hooks/useBasicApiFunctions";
import useInteraction from "../../hooks/useInteraction";
import { makeDateFormat } from "../../modules/BasicFunctions";
import { checkInnerImage } from "../../modules/TextEditorFunctions";
import cssBasic from "../../components/styles/Basic.module.css";
import css from "../article/Article.module.css";
import ImagesUnderArticle from "../article/ImagesUnderArticle";
import { formatArticlePreviewData, formatSubmittedData } from "../article/helperFunctions";
import { useTranslation } from "react-i18next";

export default function Article() {
	const navigation = useNavigate();
	const { t } = useTranslation("events");
	const { id } = useParams();
	const { create, edit, get, remove } = useBasicApiFunctions();
	const { getCategories } = useApiCategories();
	const { setMessage, setAlert } = useInteraction();
	const { register, handleSubmit, getValues, reset } = useForm();

	const [eventPreview, setEventPreview] = useState(null);
	const [body, setBody] = useState(null);
	const [underEventImages, setUnderEventImages] = useState(null);

	const originalImages = useRef([]);

	const { data: event, refetch } = useQuery({
		queryKey: ["event", id],
		queryFn: async () => {
			if (!id) {
				reset();
				setBody("");
				setUnderEventImages(null);
				return null;
			}

			const data = await get("events", id);
			setBody(data.body);
			originalImages.current = checkInnerImage(data.body);
			setUnderEventImages(data.images.length === 0 ? null : data.images);
			return data;
		},
	});

	const { data: categories } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const data = await getCategories("events");
			return data;
		},
	});

	const { mutateAsync: createEvent, status: statusCreate } = useMutation({
		mutationFn: (data) => {
			return create("events", data, t("positiveTextEventCreated"));
		},
	});

	const { mutateAsync: updateEvent, status: statusUpdate } = useMutation({
		mutationFn: (data) => {
			return edit("events", data, t("positiveTextEventUpdated"));
		},
	});

	async function onSubmit(data) {
		let formattedData = await formatSubmittedData(data, event, body, originalImages, setMessage);

		if (!formattedData) {
			return;
		}

		if (event) {
			formattedData.id = event.id;
			await updateEvent(formattedData);
			refetch();
		} else {
			await createEvent(formattedData);
			navigation("/articles");
		}
	}

	async function removeHandler() {
		await remove("events", event.id, t("positiveTextEventDeleted"));
		navigation("/events");
	}

	async function removeArticle() {
		setAlert({ id: id, question: t("alertDeleteEvent"), positiveHandler: removeHandler });
	}

	async function openArticlePreview() {
		const data = await formatArticlePreviewData(getValues(), event, body);
		setEventPreview(data);
	}

	return (
		<>
			<Helmet>
				<title>{event?.title ? event.title : t("htmlTitleNewEvent")} | SmartAdminer</title>
			</Helmet>
			{categories && (id ? event : true) ? (
				<form onSubmit={handleSubmit(onSubmit)} className={css.article} key={event?.title}>
					<section>
						<h2>{t("headerBasicInfo")}</h2>
						<InputBox
							type="text"
							name="title"
							placeholder={t("placeholderTitle")}
							register={register}
							icon={faHeading}
							defaultValue={event?.title}
							isRequired
						/>
						<InputBox
							type="text"
							name="description"
							placeholder={t("placeholderDescription")}
							register={register}
							icon={faMagnifyingGlass}
							defaultValue={event?.description}
						/>
						<Switch name="active" label={t("placeholderIsVisible")} register={register} defaultValue={event?.active} />
					</section>

					<section>
						<h2>{t("headerAdditionalInfo")}</h2>
						<DatePicker
							name="date"
							placeholder={t("placeholderDate")}
							register={register}
							additionalClasses="gray"
							defaultValue={makeDateFormat(event?.date, "str")}
							isRequired
						/>
						<Select
							name="category_id"
							options={categories}
							register={register}
							icon={faHashtag}
							placeholderValue={t("placeholderCategory")}
							defaultValue={event?.category_id}
						/>
						<ImageInput image={event?.image} name="image" path="events" register={register} />
					</section>

					<section>
						<h2>{t("headerEventBody")}</h2>
						<TextEditor value={body} setValue={setBody} key={body ? "filled" : "empty"} />
						<ImagesUnderArticle
							register={register}
							underArticleImages={underEventImages}
							setUnderArticleImages={setUnderEventImages}
							location="events"
						/>

						<div className={css.control_box}>
							<SubmitButton status={id ? statusUpdate : statusCreate} value={id ? t("buttonSave") : t("buttonCreate")} />
							<button type="button" className={css.btn_preview} onClick={openArticlePreview}>
								<FontAwesomeIcon className={css.btn_icon} icon={faEye} />
								{t("buttonPreview")}
							</button>
							{event && (
								<button type="button" className={cssBasic.btn_delete} onClick={removeArticle}>
									{t("buttonDelete")}
								</button>
							)}
						</div>
					</section>
				</form>
			) : (
				<h3>Načítání článku</h3>
			)}
			<ArticlePreview article={eventPreview} close={() => setEventPreview(null)} typeOfPreview="events" />
		</>
	);
}
