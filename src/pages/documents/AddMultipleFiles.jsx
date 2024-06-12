import { faFile, faHashtag, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import InputBox from "../../components/basic/InputBox";
import Form from "../../components/basic/form/Form";
import Select from "../../components/basic/select/Select";
import SubmitButton from "../../components/basic/submit-button/SubmitButton";
import useItemsControllerApiFunctions from "../../hooks/api/useItemsControllerApiFunctions";
import { convertBase64, makeDate } from "../../modules/BasicFunctions";
import { multipleDocumentSchema } from "../../schemas/zodSchemas";
import css from "./css/Documents.module.css";
import { zodResolver } from "@hookform/resolvers/zod";

const AddMultipleFiles = ({ close, categories }) => {
	const { t } = useTranslation("documents", "validationErrors");
	const { multipleCreate } = useItemsControllerApiFunctions();
	const formMethods = useForm({
		resolver: zodResolver(multipleDocumentSchema(t)),
	});
	const queryClient = useQueryClient();

	const { mutateAsync: createDocuments, status } = useMutation({
		mutationFn: async (data) => {
			let filesArray = [];
			for (const file of data.files) {
				const fileName = file.name.split(".");
				const base64 = await convertBase64(file);
				filesArray.push({ filename: fileName[0], file: base64 });
			}
			data.files = filesArray;
			const date = new Date();
			data.date = makeDate(
				date.getFullYear(),
				date.getMonth() + 1,
				date.getDate()
			);

			return multipleCreate(
				"documents",
				data,
				t("positiveTextDocumentsCreated")
			);
		},
		onSuccess: () => {
			formMethods.reset();
			close();
			queryClient.invalidateQueries({ queryKey: ["documents"] });
		},
	});

	return (
		<motion.section
			className={css.add_files_cont}
			initial={{ y: "-300%", x: "-50%" }}
			animate={{ y: "-50%" }}
			exit={{ y: "-300%" }}
			transition={{ type: "spring", duration: 1 }}
		>
			<FontAwesomeIcon
				className={css.close_btn}
				icon={faXmark}
				onClick={close}
			/>
			<h2>{t("headerCreateMultipleDocuments")}</h2>
			<Form onSubmit={createDocuments} formContext={formMethods}>
				<Select
					icon={faHashtag}
					name="category_id"
					options={categories}
					placeholderValue={t("placeholderCategorySelect")}
					whiteMode
				/>

				<InputBox
					type="file"
					name="files"
					icon={faFile}
					accept="*"
					multiple
					white
				/>

				<SubmitButton
					status={status}
					value={t("buttonCreate")}
					additionalCss={"blue_button"}
				/>
			</Form>
		</motion.section>
	);
};

export default AddMultipleFiles;
