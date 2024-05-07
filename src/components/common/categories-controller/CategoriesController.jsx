import { faFont } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import useCategoriesApi from "../../../hooks/api/useCategoriesApi";
import InputBox from "../../basic/InputBox";
import Item from "../controlled-item/Item";

import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import warningToast from "../warning-toast/WarningToast";
import css from "./Category.module.css";

export default function CategoriesController({
	apiClass,
	setCategories,
	filterByCategory,
	reloadData,
	fullSize,
}) {
	const { t } = useTranslation("categoriesC");
	const { getCategories, createCategory, updateCategory, deleteCategory } =
		useCategoriesApi();
	const { register, handleSubmit, setValue } = useForm();

	const { data: categories, refetch } = useQuery({
		queryKey: ["categories"],
		queryFn: async () => {
			const data = await getCategories(apiClass);
			setCategories(data);
			return data;
		},
		meta: {
			errorMessage: t("errorFetchCategories"),
		},
	});

	const create = async (data) => {
		if (categories.find((category) => category.name === data.name)) {
			warningToast(t("messageNameIsTaken"));
			return;
		}
		await createCategory(apiClass, data, t("positiveTextCreatedCategory"));
		setValue("name", "");
		refetch();
	};

	const update = async (data) => {
		await updateCategory(apiClass, data, t("positiveTextUpdatedCategory"));
		refetch();
		if (reloadData) {
			reloadData();
		}
	};

	const remove = async (id) => {
		await deleteCategory(apiClass, id, t("positiveTextDeletedCategory"));
		refetch();
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
							key={`${el.name}-${el.id}`}
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
				<InputBox
					placeholder={t("placeholderName")}
					name="name"
					register={register}
					type="text"
					icon={faFont}
					white={false}
					isRequired
				/>
				<button>{t("buttonCreateCategory")}</button>
			</form>
		</section>
	);
}
