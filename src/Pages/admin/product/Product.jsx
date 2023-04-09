import { useEffect, useState, useRef } from "react";
import InputBox from "../../Components/basic/InputBox";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faInfo, faHashtag } from "@fortawesome/free-solid-svg-icons";
import { getCategories } from "../../modules/ApiCategories";
import useAuth from "../../Hooks/useAuth";

import css from "./Product.module.css";
import cssBasic from "../styles/Basic.module.css";
import Variants from "./Variants";
import Parameters from "./Parameters";

export default function Product() {
	const auth = useAuth();
	//reference to parameters table (passed to Parameters)
	const refTableParams = useRef(null);

	const [categories, setCategories] = useState(null);
	const [pickedCategories, setPickedCategories] = useState([]);
	const [variants, setVariants] = useState([]);
	const [parameters, setParameters] = useState([]);
	const { register, handleSubmit, setValue } = useForm();

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Produkt";
		document.getElementById("banner-desc").innerHTML = "Správa produktu a jeho tvorba";
		getCategories(setCategories, "products");
	}, []);

	/**
	 * * OnChange function for category select
	 * ? Adds picked category to array of picked
	 * @param {event} e
	 * @returns
	 */
	const chooseCategory = (e) => {
		//gets name from categories via id
		const name = categories.filter((item) => item.id === parseInt(e.target.value));
		const alreadyIn = pickedCategories.find((item) => item.id === parseInt(e.target.value));
		setValue("category_id", "default");
		if (alreadyIn) {
			return;
		}

		if (name.length !== 0) {
			setPickedCategories((prev) => [...prev, name[0]]);
		}
	};

	const removeFromPicked = (e) => {
		const removed = pickedCategories.filter((item) => item.id !== parseInt(e.target.id));
		setPickedCategories(removed);
	};

	/**
	 * * Function for getting paramteres assigned to variants
	 * ? Used when form is submitted
	 * @returns {Array} objects { variantName, parameters, values }
	 */
	const getParams = () => {
		//array of table inputs
		const paramInputs = refTableParams.current?.querySelectorAll("input");

		if (!paramInputs) {
			return [];
		}

		/*
			arrParams = [
				{name: parameterName, data: ["value1", "value2"...] values of parameter for each variant}
			]
		*/
		let arrParams = [];
		let counter = 0;
		// how many inputs is for one parameter
		const devider = variants.length;

		parameters.forEach((el) => {
			arrParams.push({ name: el.name, data: [] });
		});
		// fill arrParams with data
		paramInputs.forEach((el) => {
			const arrIndex = parseInt(counter / devider);
			arrParams[arrIndex].data.push(el.value);
			++counter;
		});

		/*
			[
				{
					variant: variantName,
					param1: value,
					param2: value 
				},...
			]
		*/
		let result = [];

		variants.forEach((el) => {
			result.push({ variant: el.name });
		});

		arrParams.forEach((el) => {
			for (let i = 0; i < result.length; i++) {
				result[i][el.name] = el.data[i];
			}
		});
		console.log(result);
		return result;
	};

	return (
		<form className={css.product} onSubmit={handleSubmit()}>
			<section className={css.basic_info}>
				<h2>Základní informace:</h2>
				<InputBox placeholder="Název" register={register} type="text" name="name" icon={faShoppingCart} isRequired={true} />
				<InputBox placeholder="Popisek" register={register} type="text" name="description" icon={faInfo} isRequired={true} />
				<div className={cssBasic.input_box}>
					<select defaultValue={"default"} {...register("category_id")} onChange={chooseCategory} required>
						<option value="default" disabled>
							-- Přiřadit kategorii --
						</option>
						{categories &&
							categories.map((el) => (
								<option key={el.id} value={el.id}>
									{el.name}
								</option>
							))}
					</select>
					<FontAwesomeIcon className={cssBasic.icon} icon={faHashtag} />
				</div>
				<ul className={css.picked_categories}>
					{pickedCategories &&
						pickedCategories.map((el) => (
							<li key={el.id} id={el.id} onClick={removeFromPicked}>
								{el.name}
							</li>
						))}
				</ul>
			</section>

			<Variants variants={variants} setVariants={setVariants} />

			<Parameters variants={variants} parameters={parameters} setParameters={setParameters} refTableParams={refTableParams} />
			<button type="button" onClick={getParams}>
				Get
			</button>
		</form>
	);
}
