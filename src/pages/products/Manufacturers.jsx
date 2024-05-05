import { useForm } from "react-hook-form";
import { faFont } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import InputBox from "../../components/basic/InputBox";
import Item from "../../components/common/controlled-item/Item";
import { useCreate, useDelete, useUpdate } from "../../hooks/api/useCRUD";
import css from "../../components/common/categories-controller/Category.module.css";

export default function Manufacturers({ manufacturers }) {
	const { t } = useTranslation("products", "errors");
	const { register, handleSubmit } = useForm();

	const { mutateAsync: createManufacturer } = useCreate(
		"products/manufacturers",
		t("positiveTextManufacturerCreated"),
		t("errors:errorCRUDOperation"),
		["manufacturers"]
	);

	const { mutateAsync: updateManufacturer } = useUpdate(
		"products/manufacturers",
		t("positiveTextManufacturerUpdated"),
		t("errors:errorCRUDOperation"),
		["manufacturers"]
	);

	const { mutateAsync: deleteManufacturer } = useDelete(
		"products/manufacturers",
		t("positiveTextManufacturerDeleted"),
		t("errors:errorCRUDOperation"),
		[["manufacturers"], ["products"]]
	);

	return (
		<section className={`${css.category} half-section`}>
			<h2>{t("headerManufacturers")}</h2>
			<ul className={css.category_list}>
				{manufacturers?.length ? (
					manufacturers.map((el) => (
						<Item
							key={el.id}
							el={el}
							edit={updateManufacturer}
							remove={deleteManufacturer}
							deleteQuestion={t("alertDeleteManufacturer", { name: el.name })}
						/>
					))
				) : (
					<p>{t("noManufacturersFound")}</p>
				)}
			</ul>
			<div className={css.blur}>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<h3>{t("headerAddManufacturer")}</h3>
			<form onSubmit={handleSubmit(createManufacturer)}>
				<InputBox
					placeholder={t("placeholderManufacturerName")}
					name={"name"}
					register={register}
					type={"text"}
					icon={faFont}
					white={false}
					isRequired
				/>
				<button>{t("buttonCreate")}</button>
			</form>
		</section>
	);
}
