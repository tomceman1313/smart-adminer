import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useInteraction from "../../../Hooks/useInteraction";
import useAuth from "../../../Hooks/useAuth";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../../modules/ApiCategories";

import { faFont } from "@fortawesome/free-solid-svg-icons";

import InputBox from "../../basic/InputBox";
import Item from "../controlled-item/Item";

import css from "./Category.module.css";

export default function Category({ categories, setCategories, apiClass, filterByCategory, reloadData }) {
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
			setMessage({ action: "alert", text: "Kategorie s tímto názvem již existuje" });
			return;
		}
		await createCategory(data, auth, setMessage, apiClass);
		setValue("name", "");
		loadCategories();
	};

	const update = async (data) => {
		await updateCategory(data, auth, setMessage, apiClass);
		loadCategories();
		if (reloadData) {
			reloadData();
		}
	};

	const remove = async (id) => {
		await deleteCategory(id, auth, setMessage, apiClass);
		loadCategories();
		if (reloadData) {
			reloadData();
		}
	};

	return (
		<section className={css.category}>
			<h2>Kategorie</h2>
			<ul className={css.category_list}>
				{categories &&
					categories.map((el) => (
						<Item
							key={el.id}
							el={el}
							remove={remove}
							edit={update}
							show={filterByCategory}
							deleteQuestion={`Opravdu si přejet odstranit kategorii ${el.name}?`}
						/>
					))}
			</ul>
			<div className={css.blur}></div>
			<h3>Přidat kategorii:</h3>
			<form onSubmit={handleSubmit(create)}>
				<InputBox placeholder={"Název kategorie"} name={"name"} register={register} type={"text"} icon={faFont} white={false} isRequired={true} />
				<button>Vytvořit</button>
			</form>
		</section>
	);
}
