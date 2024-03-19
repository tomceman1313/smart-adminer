import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useInteraction from "../../Hooks/useInteraction";
import useAuth from "../../Hooks/useAuth";
import { getManufacturers, createManufacturer, updateManufacturer, deleteManufacturer } from "../../modules/ApiProductManufacturers";

import { faFont } from "@fortawesome/free-solid-svg-icons";

import InputBox from "../../Components/basic/InputBox";
import Item from "../../Components/common/controlled-item/Item";

import css from "../../Components/common/categories-component/Category.module.css";

export default function Manufacturers({ manufacturers, setManufacturers }) {
	const auth = useAuth();
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
			<h2>Výrobci</h2>
			<ul>
				{manufacturers?.length ? (
					manufacturers.map((el) => (
						<Item key={el.id} el={el} remove={remove} edit={update} deleteQuestion={`Opravdu si přejete smazat výrobce ${el.name}?`} />
					))
				) : (
					<p>Zatím nebyli přidání žádní výrobci</p>
				)}
			</ul>
			<h3>Přidat výrobce:</h3>
			<form onSubmit={handleSubmit(create)}>
				<InputBox placeholder={"Název kategorie"} name={"name"} register={register} type={"text"} icon={faFont} white={false} isRequired={true} />
				<button>Vytvořit</button>
			</form>
		</section>
	);
}
