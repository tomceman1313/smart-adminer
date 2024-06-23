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
import Form from "../../basic/form/Form";
import css from "./ArticleForm.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleSchema } from "../../../schemas/zodSchemas";

export default function ArticleForm({ type }) {
	const navigation = useNavigate();
	const { t } = useTranslation(type, "errors", "validationErrors");
	const { id } = useParams();
	const { create, edit, get, remove } = useBasicApiFunctions();
	const { getCategories } = useCategoriesApi();
	const { setAlert } = useInteraction();
	const formMethods = useForm({ resolver: zodResolver(articleSchema(t)) });

	const [eventPreview, setEventPreview] = useState(null);
	const [body, setBody] = useState(null);
	const [underEventImages, setUnderEventImages] = useState(null);

	const originalImages = useRef([]);

	const { data, refetch } = useQuery({
		queryKey: ["content", id],
		queryFn: async () => {
			if (!id) {
				formMethods.reset();
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

	const { mutateAsync: createArticle, status: statusCreate } = useMutation({
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
			formMethods.reset();
			refetch();
		} else {
			await createArticle(formattedData);
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
			formMethods.getValues(),
			data,
			body
		);

		setEventPreview(formattedData);
	}

	return (
		<>
			{data ? (
				<Helmet>
					<title>{data.title} | SmartAdminer</title>
				</Helmet>
			) : (
				<Helmet>
					<title>{t("htmlTitleNew")} | SmartAdminer</title>
				</Helmet>
			)}

			{categories && (id ? data : true) ? (
				<Form
					onSubmit={onSubmit}
					className={css.article}
					key={data?.title}
					formContext={formMethods}
				>
					<section className="half-section">
						<h2>{t("headerBasicInfo")}</h2>
						<InputBox
							type="text"
							name="title"
							placeholder={t("placeholderTitle")}
							icon={faHeading}
							defaultValue={data?.title}
						/>
						<InputBox
							type="text"
							name="description"
							placeholder={t("placeholderDescription")}
							icon={faMagnifyingGlass}
							defaultValue={data?.description}
						/>
						<Switch
							name="active"
							label={t("placeholderIsVisible")}
							defaultValue={data?.active}
						/>
					</section>

					<section className="half-section">
						<h2>{t("headerAdditionalInfo")}</h2>
						<DatePicker
							name="date"
							placeholder={t("placeholderDate")}
							additionalClasses="gray"
							defaultValue={makeDateFormat(data?.date, "str")}
						/>
						<Select
							name="category_id"
							options={categories}
							icon={faHashtag}
							placeholderValue={t("placeholderCategory")}
							defaultValue={data?.category_id}
							setValue={formMethods.setValue}
						/>
						<ImageInput image={data?.image} name="image" path={type} />
					</section>

					<section>
						<h2>{t("headerBody")}</h2>
						<TextEditor
							value={body}
							setValue={setBody}
							key={body ? "filled" : "empty"}
						/>
						<ImagesUnderArticle
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
				</Form>
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
