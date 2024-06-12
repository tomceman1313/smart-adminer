import {
	faHeading,
	faMagnifyingGlass,
	faTableColumns,
} from "@fortawesome/free-solid-svg-icons";
import { useRef, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import TextEditor from "../../components/admin/TextEditor";
import InputBox from "../../components/basic/InputBox";
import ImageInput from "../../components/basic/image-input/ImageInput";
import { convertBase64 } from "../../modules/BasicFunctions";
import {
	checkInnerImage,
	findDeletedImages,
	formatBody,
} from "../../modules/TextEditorFunctions";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import TextArea from "../../components/basic/textarea/TextArea";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import css from "./Page.module.css";
import Form from "../../components/basic/form/Form";

export default function Page() {
	const { t } = useTranslation("pages", "errors");
	const { name } = useParams();
	const { getByName, edit } = useBasicApiFunctions();
	const originalImages = useRef([]);

	const [body, setBody] = useState("");

	const { data: page, refetch } = useQuery({
		queryKey: ["pages", name],
		queryFn: async () => {
			const _page = await getByName("pages", name);
			return _page;
		},
		meta: {
			errorMessage: t("errors:errorFetchPage"),
		},
	});

	useEffect(() => {
		if (page?.body) {
			originalImages.current = checkInnerImage(page.body);
		}
	}, [page]);

	async function onSubmit(data) {
		if (data.image?.[0]) {
			const base64 = await convertBase64(data.image[0]);
			data.image = base64;
			data.prev_image = page.image ? page.image : "";
		} else {
			data.image = "";
		}

		if (!data.body) {
			let arrayInsideImages = [];
			data.body = await formatBody(body, arrayInsideImages, "pages");
			data.inner_images = arrayInsideImages;
			data.deleted_images = findDeletedImages(body, originalImages);
		}
		data.id = page.id;
		console.log(data);
		await edit("pages", data, t("positiveTextPageUpdated"));
		refetch();
	}

	return (
		<>
			<Helmet>
				<title>{t("htmlTitlePage")}</title>
			</Helmet>
			<Form onSubmit={onSubmit}>
				{page ? (
					<section className={css.page}>
						<h2 className={css.title}>{page.page_name}</h2>
						<p className={css.info}>{page.info}</p>
						{!!page.config.title && (
							<InputBox
								placeholder={t("placeholderTitle")}
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
								defaultValue={page.description}
								isRequired={true}
							/>
						)}
						{!!page.config.image && (
							<ImageInput
								image={page.image}
								name="image"
								path="pages"
								additionalClasses="half"
							/>
						)}
						{!!page.config.rich_editor ? (
							<TextEditor
								value={page.body}
								setValue={setBody}
								isLiteVersion={false}
								headers={[1, 2, 3, 4, 5]}
							/>
						) : (
							<TextArea
								name="body"
								icon={faTableColumns}
								placeholder={t("placeholderTextArea")}
								defaultValue={page.body}
							/>
						)}
						<div className={css.control_box}>
							<button>{t("buttonSave")}</button>
						</div>
					</section>
				) : (
					<h3>Načítání stránky</h3>
				)}
			</Form>
		</>
	);
}
