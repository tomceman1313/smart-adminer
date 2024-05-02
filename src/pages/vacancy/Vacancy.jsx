import {
	faEye,
	faHeading,
	faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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
import useInteraction from "../../hooks/useInteraction";
import { convertBase64, makeDateFormat } from "../../modules/BasicFunctions";
import { removeEmptyParagraphs } from "../../modules/TextEditorFunctions";

import warningToast from "../../components/common/warning-toast/WarningToast";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import css from "./Vacancy.module.css";

export default function Vacancy() {
	const { t } = useTranslation("vacancies");
	const { get, create, edit, remove } = useBasicApiFunctions();
	const { id } = useParams();
	const location = useLocation();
	const navigation = useNavigate();
	const { setAlert } = useInteraction();
	const { register, setValue, getValues, handleSubmit, reset } = useForm();

	const [vacancyPreview, setVacancyPreview] = useState(null);
	const [detailText, setDetailText] = useState(null);

	const { data: vacancy } = useQuery({
		queryKey: ["vacancy", location],
		queryFn: async () => {
			if (id) {
				const data = await get("vacancies", id);

				setValue("title", data.title);
				setValue("description", data.description);
				setValue("date", makeDateFormat(data.date, "str"));
				setValue("active", data.active);
				setDetailText(data.detail);

				return data;
			} else {
				reset();
				setDetailText("");
			}
		},
	});

	async function setData() {}

	async function onSubmit(data) {
		data.date = makeDateFormat(data.date);
		data.detail = removeEmptyParagraphs(detailText);
		data.active = data.active ? 1 : 0;

		if (data.detail === "") {
			warningToast(t("messageDetailDescriptionIsEmpty"));
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
			await edit("vacancies", data, t("positiveTextAdUpdated"));
			setData();
		} else {
			await create("vacancies", data, t("positiveTextAdCreated"));
			navigation("/vacancies", { replace: true });
		}
	}

	function deleteHandler(id) {
		navigation("/vacancies", { replace: true });
		remove("vacancies", id, t("positiveTextAdDeleted"));
	}

	async function deleteVacancy() {
		setAlert({
			id: id,
			question: t("alertDeleteAd"),
			positiveHandler: deleteHandler,
		});
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
				<title>
					{vacancy?.title ? vacancy.title : t("htmlTitleNewVacancy")} |
					SmartAdminer
				</title>
			</Helmet>
			<form onSubmit={handleSubmit(onSubmit)}>
				<section className={css.basic_info}>
					<h2>{t("headerBasicInfo")}</h2>
					<InputBox
						placeholder={t("placeholderTitle")}
						register={register}
						type="text"
						name="title"
						icon={faHeading}
						isRequired
					/>
					<InputBox
						placeholder={t("placeholderDescription")}
						register={register}
						type="text"
						name="description"
						icon={faMagnifyingGlass}
						isRequired
					/>

					<div className={css.half_cont}>
						<DatePicker
							name="date"
							register={register}
							placeholder={t("placeholderDate")}
							additionalClasses="half gray"
							isRequired
						/>

						<ImageInput
							image={vacancy?.image}
							name="image"
							path="vacancies"
							register={register}
							additionalClasses="half"
						/>
					</div>

					<Switch
						name="active"
						label={t("placeholderIsVisible")}
						register={register}
					/>
				</section>

				<section className={css.detail}>
					<h2>{t("headerDetailText")}</h2>
					{detailText !== null && (
						<TextEditor
							value={detailText}
							setValue={setDetailText}
							isLiteVersion
						/>
					)}
					<div className={css.control_box}>
						<button>{id ? t("buttonSave") : t("buttonCreate")}</button>
						<button
							type="button"
							className="blue_button"
							onClick={openVacancyPreview}
						>
							<FontAwesomeIcon className={css.btn_icon} icon={faEye} />
							{t("buttonPreview")}
						</button>
						{id && (
							<button
								type="button"
								className="red_button"
								onClick={deleteVacancy}
							>
								{t("buttonDelete")}
							</button>
						)}
					</div>
				</section>
			</form>

			<ArticlePreview
				article={vacancyPreview}
				close={() => setVacancyPreview(null)}
				typeOfPreview="vacancies"
			/>
		</>
	);
}
