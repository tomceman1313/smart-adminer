import {
	faEye,
	faHashtag,
	faHeading,
	faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import useBasicApiFunctions from "../../../hooks/api/useBasicApiFunctions";
import useCategoriesApi from "../../../hooks/api/useCategoriesApi";
import useInteraction from "../../../hooks/useInteraction";
import { makeDateFormat } from "../../../modules/BasicFunctions";
import { checkInnerImage } from "../../../modules/TextEditorFunctions";
import ImagesUnderArticle from "../../../pages/article/ImagesUnderArticle";
import {
	formatArticlePreviewData,
	formatSubmittedData,
} from "../../../pages/article/helperFunctions";
import TextEditor from "../../admin/TextEditor";
import DatePicker from "../../basic/DatePicker";
import InputBox from "../../basic/InputBox";
import ImageInput from "../../basic/image-input/ImageInput";
import Select from "../../basic/select/Select";
import SubmitButton from "../../basic/submit-button/SubmitButton";
import Switch from "../../basic/switch/Switch";
import ArticlePreview from "../article-preview/ArticlePreview";
import css from "./ArticleForm.module.css";

export default function ArticleForm({ type }) {
	const navigation = useNavigate();
	const { t } = useTranslation(type, "errors");
	const { id } = useParams();
	const { create, edit, get, remove } = useBasicApiFunctions();
	const { getCategories } = useCategoriesApi();
	const { setAlert } = useInteraction();
	const { register, handleSubmit, getValues, reset } = useForm();

	const [eventPreview, setEventPreview] = useState(null);
	const [body, setBody] = useState(null);
	const [underEventImages, setUnderEventImages] = useState(null);

	const originalImages = useRef([]);

	const { data, refetch } = useQuery({
		queryKey: ["content", id],
		queryFn: async () => {
			if (!id) {
				reset();
				setBody("");
				setUnderEventImages(null);
				return null;
			}

			const data = await get(type, id);
			setBody(data.body);
			originalImages.current = checkInnerImage(data.body);
			setUnderEventImages(data.images.length === 0 ? null : data.images);
			return data;
		},
		meta: { errorMessage: t("errors:errorFetch") },
	});

	const { data: categories } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const data = await getCategories(type);
			return data;
		},
	});

	const { mutateAsync: createEvent, status: statusCreate } = useMutation({
		mutationFn: (data) => {
			return create(type, data, t("positiveTextCreated"));
		},
	});

	const { mutateAsync: updateEvent, status: statusUpdate } = useMutation({
		mutationFn: (data) => {
			return edit(type, data, t("positiveTextUpdated"));
		},
	});

	async function onSubmit(data) {
		let formattedData = await formatSubmittedData(
			data,
			data,
			body,
			originalImages,
			type
		);

		if (!formattedData) {
			return;
		}

		if (id) {
			formattedData.id = id;
			await updateEvent(formattedData);
			refetch();
		} else {
			await createEvent(formattedData);
			navigation(`/${type}`);
		}
	}

	async function removeHandler() {
		await remove(type, data.id, t("positiveTextDeleted"));
		navigation(`/${type}`);
	}

	async function removeArticle() {
		setAlert({
			id: id,
			question: t("alertDelete"),
			positiveHandler: removeHandler,
		});
	}

	async function openArticlePreview() {
		const formattedData = await formatArticlePreviewData(
			getValues(),
			data,
			body
		);

		setEventPreview(formattedData);
	}

	return (
		<>
			<Helmet>
				<title>{t("htmlTitleNew")} | SmartAdminer</title>
			</Helmet>

			{categories && (id ? data : true) ? (
				<form
					onSubmit={handleSubmit(onSubmit)}
					className={css.article}
					key={data?.title}
				>
					<section className="half-section">
						<h2>{t("headerBasicInfo")}</h2>
						<InputBox
							type="text"
							name="title"
							placeholder={t("placeholderTitle")}
							register={register}
							icon={faHeading}
							defaultValue={data?.title}
							isRequired
						/>
						<InputBox
							type="text"
							name="description"
							placeholder={t("placeholderDescription")}
							register={register}
							icon={faMagnifyingGlass}
							defaultValue={data?.description}
						/>
						<Switch
							name="active"
							label={t("placeholderIsVisible")}
							register={register}
							defaultValue={data?.active}
						/>
					</section>

					<section className="half-section">
						<h2>{t("headerAdditionalInfo")}</h2>
						<DatePicker
							name="date"
							placeholder={t("placeholderDate")}
							register={register}
							additionalClasses="gray"
							defaultValue={makeDateFormat(data?.date, "str")}
							isRequired
						/>
						<Select
							name="category_id"
							options={categories}
							register={register}
							icon={faHashtag}
							placeholderValue={t("placeholderCategory")}
							defaultValue={data?.category_id}
						/>
						<ImageInput
							image={data?.image}
							name="image"
							path={type}
							register={register}
						/>
					</section>

					<section>
						<h2>{t("headerBody")}</h2>
						<TextEditor
							value={body}
							setValue={setBody}
							key={body ? "filled" : "empty"}
						/>
						<ImagesUnderArticle
							register={register}
							underArticleImages={underEventImages}
							setUnderArticleImages={setUnderEventImages}
							location={type}
						/>

						<div className={css.control_box}>
							<SubmitButton
								status={id ? statusUpdate : statusCreate}
								value={id ? t("buttonSave") : t("buttonCreate")}
							/>
							<button
								type="button"
								className="blue_button"
								onClick={openArticlePreview}
							>
								<FontAwesomeIcon className={css.btn_icon} icon={faEye} />
								{t("buttonPreview")}
							</button>
							{data && (
								<button
									type="button"
									className="red_button"
									onClick={removeArticle}
								>
									{t("buttonDelete")}
								</button>
							)}
						</div>
					</section>
				</form>
			) : (
				<h3>Načítání článku</h3>
			)}

			<ArticlePreview
				article={eventPreview}
				close={() => setEventPreview(null)}
				typeOfPreview={type}
			/>
		</>
	);
}
