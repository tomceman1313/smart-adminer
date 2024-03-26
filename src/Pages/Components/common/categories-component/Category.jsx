import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useInteraction from "../../../Hooks/useInteraction";
import useAuth from "../../../Hooks/useAuth";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../../modules/ApiCategories";
import { faFont } from "@fortawesome/free-solid-svg-icons";
import InputBox from "../../basic/InputBox";
import Item from "../controlled-item/Item";

import css from "./Category.module.css";
import { useTranslation } from "react-i18next";

export default function Category({ categories, setCategories, apiClass, filterByCategory, reloadData, fullSize }) {
	const { t } = useTranslation("categoriesC");
	const auth = useAuth();
	const { setMessage } = useInteraction();
	const { register, handleSubmit, setValue } = useForm();

	useEffect(() => {
		loadCategories();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const loadCategories = () => {
		getCategories(setCategories, apiClass);
	};

	const create = async (data) => {
		if (categories.find((category) => category.name === data.name)) {
			setMessage({ action: "alert", text: t("messageNameIsTaken") });
			return;
		}
		await createCategory(apiClass, data, setMessage, t("positiveTextCreatedCategory"), auth);
		setValue("name", "");
		loadCategories();
	};

	const update = async (data) => {
		await updateCategory(apiClass, data, setMessage, t("positiveTextUpdatedCategory"), auth);
		loadCategories();
		if (reloadData) {
			reloadData();
		}
	};

	const remove = async (id) => {
		await deleteCategory(apiClass, id, setMessage, t("positiveTextDeletedCategory"), auth);
		loadCategories();
		if (reloadData) {
			reloadData();
		}
	};

	return (
		<section className={`${css.category} ${fullSize ? "" : "half-section"}`}>
			<h2>{t("header")}</h2>
			<ul className={css.category_list}>
				{categories?.length ? (
					categories.map((el) => (
						<Item
							key={el.id}
							el={el}
							remove={remove}
							edit={update}
							show={filterByCategory}
							deleteQuestion={t("alertDeleteCategory", { name: el.name })}
						/>
					))
				) : (
					<p>{t("noDataFound")}</p>
				)}
			</ul>
			<div className={css.blur}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<h3>{t("headerAddCategory")}</h3>
			<form onSubmit={handleSubmit(create)}>
				<InputBox placeholder={t("placeholderName")} name={"name"} register={register} type={"text"} icon={faFont} white={false} isRequired />
				<button>{t("buttonCreateCategory")}</button>
			</form>
		</section>
	);
}
