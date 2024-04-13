import { faEye, faHashtag, faHeading, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import css from "./Article.module.css";
import ImagesUnderArticle from "./ImagesUnderArticle";
import { formatArticlePreviewData, formatSubmittedData } from "./helperFunctions";
import { useTranslation } from "react-i18next";

export default function Article() {
	const navigation = useNavigate();
	const { t } = useTranslation("articles");
	const { id } = useParams();
	const { create, edit, get, remove } = useBasicApiFunctions();
	const { getCategories } = useApiCategories();
	const { setMessage, setAlert } = useInteraction();
	const { register, handleSubmit, getValues, reset } = useForm();
	const queryClient = useQueryClient();

	const [articlePreview, setArticlePreview] = useState(null);
	const [body, setBody] = useState(null);
	const [underArticleImages, setUnderArticleImages] = useState(null);

	const originalImages = useRef([]);

	const { data: article } = useQuery({
		queryKey: ["article", id],
		queryFn: async () => {
			if (!id) {
				reset();
				setBody("");
				setUnderArticleImages(null);
				return null;
			}
			const data = await get("articles", id);
			setBody(data.body);
			originalImages.current = checkInnerImage(data.body);
			setUnderArticleImages(data.images.length === 0 ? null : data.images);
			return data;
		},
	});

	const { data: categories } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const data = await getCategories("articles");
			return data;
		},
	});

	const { mutateAsync: createArticle, status: statusCreate } = useMutation({
		mutationFn: (data) => {
			return create("articles", data, t("positiveTextArticleCreated"));
		},
	});

	const { mutateAsync: updateArticle, status: statusUpdate } = useMutation({
		mutationFn: (data) => {
			return edit("articles", data, t("positiveTextArticleUpdated"));
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["article"] });
		},
	});

	async function onSubmit(data) {
		let formattedData = await formatSubmittedData(data, article, body, originalImages, setMessage);
		if (!formattedData) {
			return;
		}

		if (article) {
			formattedData.id = article.id;
			await updateArticle(formattedData);
		} else {
			await createArticle(formattedData);
			navigation("/articles");
		}
	}

	async function removeHandler() {
		await remove("articles", article.id, t("positiveTextArticleDeleted"));
		navigation("/articles");
	}

	async function removeArticle() {
		setAlert({ id: id, question: t("alertDeleteArticle"), positiveHandler: removeHandler });
	}

	async function openArticlePreview() {
		const data = await formatArticlePreviewData(getValues(), article, body);
		setArticlePreview(data);
	}

	return (
		<>
			<Helmet>
				<title>{article?.title ? article.title : t("htmlTitleNewArticle")} | SmartAdminer</title>
			</Helmet>
			{categories && (id ? article : true) ? (
				<form onSubmit={handleSubmit(onSubmit)} className={css.article} key={article?.title}>
					<section>
						<h2>{t("headerBasicInfo")}</h2>
						<InputBox
							type="text"
							name="title"
							placeholder={t("placeholderTitle")}
							register={register}
							icon={faHeading}
							defaultValue={article?.title}
							isRequired
						/>
						<InputBox
							type="text"
							name="description"
							placeholder={t("placeholderDescription")}
							register={register}
							icon={faMagnifyingGlass}
							defaultValue={article?.description}
						/>
						<Switch name="active" label={t("placeholderIsVisible")} register={register} defaultValue={article?.active} />
					</section>

					<section>
						<h2>{t("headerAdditionalInfo")}</h2>
						<DatePicker
							name="date"
							placeholder={t("placeholderDate")}
							register={register}
							additionalClasses="gray"
							defaultValue={makeDateFormat(article?.date, "str")}
							isRequired
						/>
						<Select
							name="category_id"
							options={categories}
							register={register}
							icon={faHashtag}
							placeholderValue={t("placeholderCategory")}
							defaultValue={article?.category_id}
						/>
						<ImageInput image={article?.image} name="image" path="articles" register={register} />
					</section>

					<section>
						<h2>{t("headerArticleBody")}</h2>
						<TextEditor value={body} setValue={setBody} key={body ? "filled" : "empty"} />
						<ImagesUnderArticle
							register={register}
							underArticleImages={underArticleImages}
							setUnderArticleImages={setUnderArticleImages}
							location="articles"
						/>

						<div className={css.control_box}>
							<SubmitButton status={id ? statusUpdate : statusCreate} value={id ? t("buttonSave") : t("buttonCreate")} />
							<button type="button" className={css.btn_preview} onClick={openArticlePreview}>
								<FontAwesomeIcon className={css.btn_icon} icon={faEye} />
								{t("buttonPreview")}
							</button>
							{article && (
								<button type="button" className="red_button" onClick={removeArticle}>
									{t("buttonDelete")}
								</button>
							)}
						</div>
					</section>
				</form>
			) : (
				<h3>Načítání článku</h3>
			)}
			<ArticlePreview article={articlePreview} close={() => setArticlePreview(null)} typeOfPreview="articles" />
		</>
	);
}
