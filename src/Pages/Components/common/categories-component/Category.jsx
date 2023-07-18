import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useInteraction from "../../../Hooks/useInteraction";
import useAuth from "../../../Hooks/useAuth";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../../modules/ApiCategories";

import { faFont } from "@fortawesome/free-solid-svg-icons";

import InputBox from "../../basic/InputBox";
import Item from "../../../admin/gallery/Item";

import css from "./Category.module.css";

const Category = ({ categories, setCategories, apiClass, filterByCategory }) => {
	const auth = useAuth();
	const { setMessage } = useInteraction();
	const { register, handleSubmit, setValue } = useForm();

	useEffect(() => {
		get();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const get = () => {
		getCategories(setCategories, apiClass);
	};

	const create = async (data) => {
		await createCategory(data, auth, setMessage, apiClass);
		setValue("name", "");
		get();
	};

	const update = async (data) => {
		await updateCategory(data, auth, setMessage, apiClass);
		get();
	};

	const remove = async (id) => {
		await deleteCategory(id, auth, setMessage, apiClass);
		get();
	};

	return (
		<section className={css.category}>
			<h2>Kategorie</h2>
			<ul className={css.category_list}>
				{categories && categories.map((el) => <Item key={el.id} el={el} remove={remove} edit={update} show={filterByCategory} />)}
			</ul>
			<h3>Přidat kategorii:</h3>
			<form onSubmit={handleSubmit(create)}>
				<InputBox placeholder={"Název kategorie"} name={"name"} register={register} type={"text"} icon={faFont} white={false} isRequired={true} />
				<button>Vytvořit</button>
			</form>
		</section>
	);
};

export default Category;
