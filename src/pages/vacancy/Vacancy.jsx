import { faEye, faHeading, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TextEditor from "../../components/admin/TextEditor";
import DatePicker from "../../components/basic/DatePicker";
import InputBox from "../../components/basic/InputBox";
import ImageInput from "../../components/basic/image-input/ImageInput";
import Switch from "../../components/basic/switch/Switch";
import ArticlePreview from "../../components/common/article-preview/ArticlePreview";
import useAuth from "../../hooks/useAuth";
import useInteraction from "../../hooks/useInteraction";
import { create, edit, get, remove } from "../../modules/ApiFunctions";
import { convertBase64, makeDateFormat } from "../../modules/BasicFunctions";
import { removeEmptyParagraphs } from "../../modules/TextEditorFunctions";

import css from "./Vacancy.module.css";

export default function Vacancy() {
	const { t } = useTranslation("vacancies");
	const auth = useAuth();
	const { setMessage, setAlert } = useInteraction();
	const { register, setValue, getValues, handleSubmit, reset } = useForm();

	const [vacancy, setVacancy] = useState(null);
	const [vacancyPreview, setVacancyPreview] = useState(null);
	const [detailText, setDetailText] = useState(null);

	const { id } = useParams();
	let location = useLocation();
	const navigation = useNavigate();

	useEffect(() => {
		if (id) {
			setData();
		} else {
			reset();
			setDetailText("");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	async function setData() {
		const data = await get("vacancies", id);
		//console.log(data);
		setValue("title", data.title);
		setValue("description", data.description);
		setValue("date", makeDateFormat(data.date, "str"));
		setValue("active", data.active);
		setDetailText(data.detail);
		setVacancy(data);
	}

	async function onSubmit(data) {
		data.date = makeDateFormat(data.date);
		data.detail = removeEmptyParagraphs(detailText);
		data.active = data.active ? 1 : 0;

		if (data.detail === "") {
			setMessage({ action: "alert", text: t("messageDetailDescriptionIsEmpty") });
			return;
		}

		if (data.image[0]) {
			const base64 = await convertBase64(data.image[0]);
			data.image = base64;
			if (id) {
				data.previous_image = vacancy.image;
			}
		} else {
			delete data.image;
		}

		if (id) {
			data.id = id;
			await edit("vacancies", data, setMessage, t("positiveTextAdUpdated"), auth);
			setData();
		} else {
			await create("vacancies", data, setMessage, t("positiveTextAdCreated"), auth);
			navigation("/vacancies", { replace: true });
		}
	}

	function deleteHandler(id) {
		navigation("/vacancies", { replace: true });
		remove("vacancies", id, setMessage, t("positiveTextAdDeleted"), auth);
	}

	async function deleteVacancy() {
		setAlert({ id: id, question: t("alertDeleteAd"), positiveHandler: deleteHandler });
	}

	async function openVacancyPreview() {
		let data = getValues();
		data.date = makeDateFormat(data.date);
		if (data.image?.[0]) {
			const base64 = await convertBase64(data.image[0]);
			data.image = base64;
		} else {
			data.image = vacancy ? vacancy.image : null;
		}

		data.body = removeEmptyParagraphs(detailText);
		setVacancyPreview(data);
	}

	return (
		<>
			<Helmet>
				<title>{vacancy?.title ? vacancy.title : t("htmlTitleNewVacancy")} | SmartAdminer</title>
			</Helmet>
			<form onSubmit={handleSubmit(onSubmit)}>
				<section className={css.basic_info}>
					<h2>{t("headerBasicInfo")}</h2>
					<InputBox placeholder={t("placeholderTitle")} register={register} type="text" name="title" icon={faHeading} isRequired />
					<InputBox
						placeholder={t("placeholderDescription")}
						register={register}
						type="text"
						name="description"
						icon={faMagnifyingGlass}
						isRequired
					/>

					<div className={css.half_cont}>
						<DatePicker name="date" register={register} placeholder={t("placeholderDate")} additionalClasses="half gray" isRequired />

						<ImageInput image={vacancy?.image} name="image" path="vacancies" register={register} additionalClasses="half" />
					</div>

					<Switch name="active" label={t("placeholderIsVisible")} register={register} />
				</section>

				<section className={css.detail}>
					<h2>{t("headerDetailText")}</h2>
					{detailText !== null && <TextEditor value={detailText} setValue={setDetailText} isLiteVersion />}
					<div className={css.control_box}>
						<button>{id ? t("buttonSave") : t("buttonCreate")}</button>
						<button type="button" className="blue_button" onClick={openVacancyPreview}>
							<FontAwesomeIcon className={css.btn_icon} icon={faEye} />
							{t("buttonPreview")}
						</button>
						{id && (
							<button type="button" className="red_button" onClick={deleteVacancy}>
								{t("buttonDelete")}
							</button>
						)}
					</div>
				</section>
			</form>

			<ArticlePreview article={vacancyPreview} close={() => setVacancyPreview(null)} typeOfPreview="vacancies" />
		</>
	);
}
