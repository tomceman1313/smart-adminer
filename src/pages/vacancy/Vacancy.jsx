import {
	faEye,
	faHeading,
	faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "../../components/admin/TextEditor";
import DatePicker from "../../components/basic/DatePicker";
import InputBox from "../../components/basic/InputBox";
import Form from "../../components/basic/form/Form";
import ImageInput from "../../components/basic/image-input/ImageInput";
import Switch from "../../components/basic/switch/Switch";
import ArticlePreview from "../../components/common/article-preview/ArticlePreview";
import warningToast from "../../components/common/warning-toast/WarningToast";
import {
	useCreate,
	useDelete,
	useGet,
	useUpdate,
} from "../../hooks/api/useCRUD";
import useInteraction from "../../hooks/useInteraction";
import {
	convertBase64,
	getTodayDate,
	makeDateFormat,
} from "../../modules/BasicFunctions";
import { removeEmptyParagraphs } from "../../modules/TextEditorFunctions";
import { vacancySchema } from "../../schemas/zodSchemas";
import css from "./Vacancy.module.css";

export default function Vacancy() {
	const { t } = useTranslation("vacancies", "errors", "validationErrors");
	const { id } = useParams();
	const navigation = useNavigate();
	const { setAlert } = useInteraction();
	const formMethods = useForm({ resolver: zodResolver(vacancySchema(t)) });

	const [vacancyPreview, setVacancyPreview] = useState(null);
	const [detailText, setDetailText] = useState("");

	const { data: vacancy, refetch } = useGet(
		"vacancies",
		id,
		["vacancy"],
		t("errors:errorFetchVacancy")
	);

	const { mutateAsync: create } = useCreate(
		"vacancies",
		t("positiveTextAdCreated"),
		t("errors:errorCRUDOperation"),
		["vacancy"]
	);

	const { mutateAsync: edit } = useUpdate(
		"vacancies",
		t("positiveTextAdUpdated"),
		t("errors:errorCRUDOperation"),
		["vacancy"]
	);

	const { mutateAsync: remove } = useDelete(
		"vacancies",
		t("positiveTextAdDeleted"),
		t("errors:errorCRUDOperation"),
		["vacancies"]
	);

	useEffect(() => {
		if (!vacancy) {
			formMethods.reset();
			formMethods.setValue("date", getTodayDate());
			return;
		}

		formMethods.setValue("title", vacancy.title);
		formMethods.setValue("description", vacancy.description);
		formMethods.setValue("active", !!vacancy.active);
		formMethods.setValue("date", makeDateFormat(vacancy.date, "str"));
		setDetailText(vacancy.detail);
	}, [vacancy, formMethods]);

	async function onSubmit(data) {
		data.date = makeDateFormat(data.date);
		data.detail = removeEmptyParagraphs(detailText);
		data.active = data.active ? 1 : 0;

		if (data.detail === "") {
			warningToast(t("messageDetailDescriptionIsEmpty"));
			return;
		}

		if (data?.image?.[0]) {
			const base64 = await convertBase64(data.image[0]);
			data.image = base64;
			if (id) {
				data.previous_image = vacancy.image;
			}
		} else {
			delete data.image;
		}

		if (id) {
			await edit(data);
			refetch();
		} else {
			await create(data);
			navigation("/vacancies", { replace: true });
		}
	}

	async function deleteHandler(id) {
		await remove(id);
		navigation("/vacancies", { replace: true });
	}

	async function openVacancyPreview() {
		let data = formMethods.getValues();
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
			<Form onSubmit={onSubmit} formContext={formMethods}>
				<section className={css.basic_info}>
					<h2>{t("headerBasicInfo")}</h2>
					<InputBox
						placeholder={t("placeholderTitle")}
						type="text"
						name="title"
						icon={faHeading}
					/>
					<InputBox
						placeholder={t("placeholderDescription")}
						type="text"
						name="description"
						icon={faMagnifyingGlass}
					/>

					<div className={css.half_cont}>
						<DatePicker
							name="date"
							placeholder={t("placeholderDate")}
							additionalClasses="half gray"
						/>

						<ImageInput
							image={vacancy?.image}
							name="image"
							path="vacancies"
							additionalClasses="half"
							required={false}
						/>
					</div>

					<Switch name="active" label={t("placeholderIsVisible")} />
				</section>

				<section className={css.detail}>
					<h2>{t("headerDetailText")}</h2>
					<TextEditor
						value={detailText}
						setValue={setDetailText}
						key={detailText !== "" ? "filled" : "empty"}
						isLiteVersion
					/>
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
								onClick={() =>
									setAlert({
										id: id,
										question: t("alertDeleteAd"),
										positiveHandler: deleteHandler,
									})
								}
							>
								{t("buttonDelete")}
							</button>
						)}
					</div>
				</section>
				<input type="hidden" value={id} {...formMethods.register("id")} />
			</Form>

			<ArticlePreview
				article={vacancyPreview}
				close={() => setVacancyPreview(null)}
				typeOfPreview="vacancies"
			/>
		</>
	);
}
