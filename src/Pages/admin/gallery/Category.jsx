import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../modules/ApiGallery";
import useInteraction from "../../Hooks/useInteraction";

import { faFont } from "@fortawesome/free-solid-svg-icons";

import Item from "./Item";
import InputBox from "../../Components/basic/InputBox";

import css from "./css/Category.module.css";

const Category = ({ auth }) => {
	const { setMessage } = useInteraction();

	const [categories, setCategories] = useState(null);
	const { register, handleSubmit } = useForm();

	useEffect(() => {
		get();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const get = () => {
		getCategories(auth, setCategories);
	};

	const create = (data) => {
		createCategory(data, auth, setMessage);
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

	return (
		<section className={css.category}>
			<h2>Kategorie</h2>
			<ul className={css.category_list}>{categories && categories.map((el) => <Item key={el.id} el={el} remove={remove} edit={update} />)}</ul>
			<form onSubmit={handleSubmit(create)}>
				<InputBox placeholder={"Název nové kategorie"} name={"name"} register={register} type={"text"} icon={faFont} white={false} />
				<button>Vytvořit</button>
			</form>
		</section>
	);
};

export default Category;
