import { faHashtag, faImage, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import SubmitButton from "../../components/basic/submit-button/SubmitButton";
import cssBasic from "../../components/styles/Basic.module.css";
import useItemsControllerApiFunctions from "../../hooks/api/useItemsControllerApiFunctions";
import { convertBase64, makeDate } from "../../modules/BasicFunctions";
import css from "./css/Documents.module.css";

const AddMultipleFiles = ({ close, categories }) => {
	const { t } = useTranslation("documents");
	const { multipleCreate } = useItemsControllerApiFunctions();
	const { register, handleSubmit, reset } = useForm();
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
			reset();
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
			<form onSubmit={handleSubmit(createDocuments)}>
				<div className={`${cssBasic.input_box} ${cssBasic.white_color}`}>
					<select
						defaultValue={"default"}
						{...register("category_id")}
						required
					>
						<option value="default" disabled>
							{t("placeholderCategorySelect")}
						</option>
						{categories &&
							categories.map((el) => (
								<option key={el.id} value={el.id}>
									{el.name}
								</option>
							))}
					</select>
					<FontAwesomeIcon className={cssBasic.icon} icon={faHashtag} />
				</div>

				<div className={`${cssBasic.input_box} ${cssBasic.white_color}`}>
					<input type="file" accept="*" {...register("files")} multiple />
					<FontAwesomeIcon className={cssBasic.icon} icon={faImage} />
				</div>

				<SubmitButton
					status={status}
					value={t("buttonCreate")}
					additionalCss={"blue_button"}
				/>
			</form>
		</motion.section>
	);
};

export default AddMultipleFiles;
