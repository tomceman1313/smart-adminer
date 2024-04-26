import React from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import InputBox from "../../components/basic/InputBox";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import { faFont } from "@fortawesome/free-solid-svg-icons";

import css from "../../components/common/categories-controller/Category.module.css";

export default function AddNewPermissionClassForm() {
	const { t } = useTranslation("profiles");
	const { register, handleSubmit, setValue } = useForm();
	const { create } = useBasicApiFunctions();

	async function createHandler(data) {
		await create(
			"users/permissions",
			data,
			t("positiveTextPermissionClassCreated")
		);
		setValue("class", "");
	}

	return (
		<section className={`${css.category} half-section`}>
			<h2>{t("headerAddNewPermissionClass")}</h2>
			<p>{t("paragraphAddingNewSectionInfo")}</p>
			<form onSubmit={handleSubmit(createHandler)}>
				<InputBox
					placeholder={t("placeholderClassName")}
					name="class"
					register={register}
					type="text"
					icon={faFont}
					white={false}
					isRequired
				/>
				<button>{t("createButton")}</button>
			</form>
		</section>
	);
}
