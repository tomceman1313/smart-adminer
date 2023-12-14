import { faCalendarDays, faEye, faHeading, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TextEditor from "../../Components/admin/TextEditor";
import InputBox from "../../Components/basic/InputBox";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { create, edit, get, remove } from "../../modules/ApiFunctions";
import { convertBase64, makeDateFormat } from "../../modules/BasicFunctions";
import { removeEmptyParagraphs } from "../../modules/TextEditorFunctions";
import ArticlePreview from "../../Components/common/article-preview/ArticlePreview";
import ImageInput from "../../Components/basic/image-input/ImageInput";
import Switch from "../../Components/basic/switch/Switch";
import { Helmet } from "react-helmet";

import cssBasic from "../styles/Basic.module.css";
import css from "./Vacancy.module.css";

export default function Vacancy() {
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
			setMessage({ action: "alert", text: "Detailní popis musí být vyplněn" });
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
			await edit("vacancies", data, setMessage, "Inzerát byl upraven", auth);
			setData();
		} else {
			await create("vacancies", data, setMessage, "Inzerát by vytvořen", auth);
			navigation("/vacancies", { replace: true });
		}
	}

	function deleteHandler(id) {
		navigation("/vacancies", { replace: true });
		remove("vacancies", id, setMessage, "Inzerát byl odstraněn", auth);
	}

	async function deleteVacancy() {
		setAlert({ id: id, question: "Opravdu si přejete smazat inzerát?", positiveHandler: deleteHandler });
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
				<title>{vacancy?.title ? vacancy.title : "Nový inzerát"} | SmartAdminer</title>
			</Helmet>
			<form onSubmit={handleSubmit(onSubmit)}>
				<section className={css.basic_info}>
					<h2>Základní informace:</h2>
					<InputBox placeholder="Název" register={register} type="text" name="title" icon={faHeading} isRequired={true} />
					<InputBox placeholder="Popisek" register={register} type="text" name="description" icon={faMagnifyingGlass} isRequired={true} />

					<div className={css.half_cont}>
						<div className={`${cssBasic.input_box} ${css.half}`} title="Datum zveřejnění">
							<input type="date" {...register("date")} required />
							<FontAwesomeIcon className={cssBasic.icon} icon={faCalendarDays} />
						</div>

						<ImageInput image={vacancy?.image} name="image" path="vacancies" register={register} additionalClasses="half" />
					</div>

					<Switch name="active" label="Inzerát je viditelný:" register={register} />
				</section>

				<section className={css.detail}>
					<h2>Detailní popis</h2>
					<TextEditor value={detailText} setValue={setDetailText} isLiteVersion={true} />
					<div className={css.control_box}>
						<button>Uložit</button>
						<button type="button" className="blue_button" onClick={openVacancyPreview}>
							<FontAwesomeIcon className={css.btn_icon} icon={faEye} />
							Náhled inzerátu
						</button>
						{id && (
							<button type="button" className="red_button" onClick={deleteVacancy}>
								Smazat
							</button>
						)}
					</div>
				</section>
			</form>

			<ArticlePreview article={vacancyPreview} close={() => setVacancyPreview(null)} typeOfPreview="vacancies" />
		</>
	);
}
