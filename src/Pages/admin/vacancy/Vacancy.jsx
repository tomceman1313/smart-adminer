import { faCalendarDays, faEye, faHeading, faImage, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TextEditor from "../../Components/admin/TextEditor";
import InputBox from "../../Components/basic/InputBox";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { get, remove, edit, create } from "../../modules/ApiFunctions";
import { convertBase64, openImage, publicPath, makeDateFormat } from "../../modules/BasicFunctions";

import cssBasic from "../styles/Basic.module.css";
import css from "./Vacancy.module.css";

export default function Vacancy() {
	const auth = useAuth();
	const { setMessage, setAlert } = useInteraction();

	const { register, setValue, handleSubmit, reset } = useForm();
	const [vacancy, setVacancy] = useState(null);
	const [detailText, setDetailText] = useState(null);
	const [imageIsSet, setImageIsSet] = useState(false);

	const { id } = useParams();
	let location = useLocation();
	const navigation = useNavigate();

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Inzerát pracovní pozice";
		document.getElementById("banner-desc").innerHTML = "Tvořte a spravujte inzeráty pracovních pozic";
		if (id) {
			setData();
		} else {
			reset();
			setDetailText("");
			setImageIsSet(false);
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
		setImageIsSet(data.image);
		setDetailText(data.detail);
		setVacancy(data);
	}

	async function onSubmit(data) {
		data.date = makeDateFormat(data.date);
		data.detail = detailText;
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
			console.log(JSON.stringify({ data: data }));
			edit("vacancies", data, setMessage, "Inzerát byl upraven", auth);
		} else {
			console.log(data);
			create("vacancies", data, setMessage, "Inzerát by vytvořen", auth);
			navigation("/dashboard/vacancies", { replace: true });
		}
	}

	function deleteHandler(id) {
		navigation("/dashboard/vacancies", { replace: true });
		remove("vacancies", id, setMessage, "Inzerát byl odstraněn", auth);
	}

	async function deleteVacancy() {
		setAlert({ id: id, question: "Opravdu si přejete smazat inzerát?", positiveHandler: deleteHandler });
	}

	return (
		<>
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

						<div className={`${cssBasic.input_box} ${css.half}`}>
							{imageIsSet ? (
								<div className={cssBasic.image_box}>
									<button type="button" onClick={() => openImage(`${publicPath}/images/vacancies/${imageIsSet}`)}>
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
					</div>

					<p>Inzerát je viditelný: </p>
					<label className="switch">
						<input type="checkbox" {...register("active")} />
						<span className="slider"></span>
					</label>
				</section>

				<section className={css.detail}>
					<h2>Detailní popis</h2>
					<TextEditor value={detailText} setValue={setDetailText} />
					<div className={css.control_box}>
						<button>Uložit</button>
						<button type="button" className="blue_button">
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
		</>
	);
}
