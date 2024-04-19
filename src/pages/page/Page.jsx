import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import InputBox from "../../components/basic/InputBox";
import ImageInput from "../../components/basic/image-input/ImageInput";
import TextEditor from "../../components/admin/TextEditor";
import { faHeading, faMagnifyingGlass, faTableColumns } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { getByName, edit } from "../../modules/ApiFunctions";
import { convertBase64 } from "../../modules/BasicFunctions";
import { formatBody, findDeletedImages, checkInnerImage } from "../../modules/TextEditorFunctions";
import useInteraction from "../../hooks/useInteraction";
import useAuth from "../../hooks/useAuth";
import { Helmet } from "react-helmet-async";

import css from "./Page.module.css";
import TextArea from "../../components/basic/textarea/TextArea";
import { useTranslation } from "react-i18next";

export default function Page() {
	const { t } = useTranslation("pages");
	const { name } = useParams();
	const auth = useAuth();
	const { setMessage } = useInteraction();
	const { register, handleSubmit } = useForm();

	const [page, setPage] = useState();
	const [body, setBody] = useState("");
	const originalImages = useRef([]);

	useEffect(() => {
		loadPage();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name]);

	async function loadPage() {
		const _page = await getByName("pages", name);
		if (!!_page.config.rich_editor) {
			setBody(_page.body);
			originalImages.current = checkInnerImage(_page.body);
		}
		setPage(_page);
	}

	async function onSubmit(data) {
		if (data.image?.[0]) {
			const base64 = await convertBase64(data.image[0]);
			data.image = base64;
			data.prev_image = page.image;
		} else {
			data.image = page.image;
		}

		if (!data.body) {
			let arrayInsideImages = [];
			data.body = await formatBody(body, arrayInsideImages, "pages");
			data.inner_images = arrayInsideImages;
			data.deleted_images = findDeletedImages(body, originalImages);
		}

		data.id = page.id;
		await edit("pages", data, setMessage, "Stránka byla upravena", auth);
	}

	return (
		<>
			<Helmet>
				<title>{t("htmlTitlePage")}</title>
			</Helmet>
			<form onSubmit={handleSubmit(onSubmit)}>
				{page ? (
					<section className={css.page}>
						<h2>{page.page_name}</h2>
						<p>{page.info}</p>
						{!!page.config.title && (
							<InputBox
								placeholder={t("placeholderTitle")}
								register={register}
								type="text"
								name="title"
								icon={faHeading}
								defaultValue={page.title}
								isRequired={true}
							/>
						)}
						{!!page.config.description && (
							<TextArea
								name="description"
								placeholder={t("placeholderDescription")}
								icon={faMagnifyingGlass}
								register={register}
								defaultValue={page.description}
								isRequired={true}
							/>
						)}
						{!!page.config.image && <ImageInput image={page.image} name="image" path="pages" register={register} additionalClasses="half" />}
						{!!page.config.rich_editor ? (
							<TextEditor value={body} setValue={setBody} isLiteVersion={false} headers={[1, 2, 3, 4, 5]} />
						) : (
							<TextArea name="body" icon={faTableColumns} register={register} placeholder={t("placeholderTextArea")} defaultValue={page.body} />
						)}
						<div className={css.control_box}>
							<button>{t("buttonSave")}</button>
						</div>
					</section>
				) : (
					<h3>Načítání stránky</h3>
				)}
			</form>
		</>
	);
}