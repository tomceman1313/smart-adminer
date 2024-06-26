import { faFont } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import InputBox from "../../components/basic/InputBox";

import css from "../../components/common/categories-controller/Category.module.css";
import { useCreate } from "../../hooks/api/useCRUD";

export default function AddNewPermissionClassForm() {
	const { t } = useTranslation("profiles", "errors");
	const { register, handleSubmit, setValue } = useForm();
	const { mutateAsync: create } = useCreate(
		"users/permissions",
		t("positiveTextPermissionClassCreated"),
		t("errors:errorCRUDOperation"),
		["roles"]
	);

	async function createHandler(data) {
		await create(data);
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
