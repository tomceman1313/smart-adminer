import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../modules/ApiGallery";
import useInteraction from "../../Hooks/useInteraction";
import { getByCategory } from "../../modules/ApiGallery";

import { faFont } from "@fortawesome/free-solid-svg-icons";

import Item from "./Item";
import InputBox from "../../Components/basic/InputBox";

import css from "./css/Category.module.css";

const Category = ({ auth, setImages, setSelectedCategory }) => {
	const { setMessage } = useInteraction();

	const [categories, setCategories] = useState(null);
	const { register, handleSubmit, setValue } = useForm();

	useEffect(() => {
		get();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const get = () => {
		getCategories(auth, setCategories);
	};

	const create = (data) => {
		createCategory(data, auth, setMessage);
		setValue("name", "");
		get();
	};

	const update = (data) => {
		updateCategory(data, auth, setMessage);
		get();
	};

	const remove = (id) => {
		deleteCategory(id, auth, setMessage, get);
		get();
	};

	const showCategory = (id) => {
		getByCategory(id, setImages, auth);
		const categoryName = categories.filter((item) => item.id === id);
		setSelectedCategory(categoryName[0].name);
	};

	return (
		<section className={css.category}>
			<h2>Kategorie</h2>
			<ul className={css.category_list}>{categories && categories.map((el) => <Item key={el.id} el={el} remove={remove} edit={update} show={showCategory} />)}</ul>
			<h3>Přidat kategorii:</h3>
			<form onSubmit={handleSubmit(create)}>
				<InputBox placeholder={"Název kategorie"} name={"name"} register={register} type={"text"} icon={faFont} white={false} isRequired={true} />
				<button>Vytvořit</button>
			</form>
		</section>
	);
};

export default Category;
