import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useInteraction from "../../hooks/useInteraction";
import useAuth from "../../hooks/useAuth";
import { getManufacturers, createManufacturer, updateManufacturer, deleteManufacturer } from "../../modules/ApiProductManufacturers";

import { faFont } from "@fortawesome/free-solid-svg-icons";

import InputBox from "../../components/basic/InputBox";
import Item from "../../components/common/controlled-item/Item";

import css from "../../components/common/categories-controller/Category.module.css";
import { useTranslation } from "react-i18next";

export default function Manufacturers({ manufacturers, setManufacturers }) {
	const auth = useAuth();
	const { t } = useTranslation("products");
	const { setMessage } = useInteraction();
	const { register, handleSubmit, setValue } = useForm();

	useEffect(() => {
		get();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const get = () => {
		getManufacturers(setManufacturers);
	};

	const create = async (data) => {
		await createManufacturer(data, auth, setMessage);
		setValue("name", "");
		get();
	};

	const update = async (data) => {
		await updateManufacturer(data, auth, setMessage);
		get();
	};

	const remove = async (id) => {
		await deleteManufacturer(id, auth, setMessage);
		get();
	};

	return (
		<section className={css.category}>
			<h2>{t("headerManufacturers")}</h2>
			<ul className={css.category_list}>
				{manufacturers?.length ? (
					manufacturers.map((el) => (
						<Item key={el.id} el={el} remove={remove} edit={update} deleteQuestion={t("alertDeleteManufacturer", { name: el.name })} />
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
			<form onSubmit={handleSubmit(create)}>
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
