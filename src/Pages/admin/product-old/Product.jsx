import { faHashtag, faInfo, faShoppingCart, faEye, faCopyright } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import InputBox from "../../Components/basic/InputBox";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { getCategories } from "../../modules/ApiCategories";
import { create, edit, remove } from "../../modules/ApiFunctions";
import { getManufacturers } from "../../modules/ApiProductManufacturers";
import { getProduct } from "../../modules/ApiProducts";
import { convertBase64 } from "../../modules/BasicFunctions";

import cssBasic from "../styles/Basic.module.css";
import DetailText from "./DetailText";
import Images from "./Images";
import Parameters from "./Parameters";
import css from "./Product.module.css";
import Variants from "./Variants";

export default function Product() {
	const auth = useAuth();
	const { id } = useParams();
	let location = useLocation();
	const navigate = useNavigate();
	const { setMessage, setAlert } = useInteraction();
	//reference to parameters table (passed to Parameters)
	const refTableParams = useRef(null);

	const [categories, setCategories] = useState(null);
	const [manufacturers, setManufacturers] = useState(null);
	const [pickedCategories, setPickedCategories] = useState([]);
	const [variants, setVariants] = useState([]);
	const [parameters, setParameters] = useState([]);
	const [detailText, setDetailText] = useState("");
	const [images, setImages] = useState(null);
	const { register, handleSubmit, setValue, reset } = useForm();

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Produkt";
		document.getElementById("banner-desc").innerHTML = "Správa produktu a jeho tvorba";
		getCategories(setCategories, "products");
		getManufacturers(setManufacturers);

		if (id) {
			setData();
		} else {
			reset();
			setVariants([]);
			setParameters([]);
			setDetailText("");
			setPickedCategories([]);
			setImages(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

	async function onSubmit(data) {
		let imagesArray = [];
		let order = images?.length ? images?.length : 0;

		if (images?.length === 0 && data.images.length === 0) {
			setMessage({ action: "alert", text: "Produkt nemůže být bez obrázku." });
			return;
		}
		for (const file of data.images) {
			const base64 = await convertBase64(file);
			imagesArray.push({ file: base64, order: order });
			++order;
		}
		data.new_images = imagesArray;

		data.params = await getParams();
		data.variants = variants;
		data.detail = detailText;
		data.categories = pickedCategories;
		if (id) {
			data.id = id;
			data.images = images;
			console.log(data);
			edit("products", data, setMessage, "Produkt upraven", auth);
		} else {
			create("products", data, setMessage, "Produkt vložen", auth);
		}
	}

	/**
	 * * Adds selected category to array of picked
	 * ? Triggered when user choose category from <select>
	 * @param {event} e
	 * @returns
	 */
	function chooseCategory(e) {
		//gets name from categories via id
		const name = categories.filter((item) => item.id === parseInt(e.target.value));
		const alreadyIn = pickedCategories.find((item) => item.id === parseInt(e.target.value));
		setValue("categories", "default");
		if (alreadyIn) {
			return;
		}

		if (name.length !== 0) {
			setPickedCategories((prev) => [...prev, name[0]]);
		}
	}

	function removeFromPicked(e) {
		const removed = pickedCategories.filter((item) => item.id !== parseInt(e.target.id));
		setPickedCategories(removed);
	}

	/**
	 * * Function for getting paramteres assigned to variants
	 * ? Used when form is submitted
	 * @returns {Array} [...,[{name: "width", value: 122}, {name: "height", value: 1222}]]
	 */
	async function getParams() {
		//array of table inputs
		const paramInputs = refTableParams.current?.querySelectorAll("input");

		if (!paramInputs) {
			return [];
		}
		// final array with all params for each variant
		let variantParams = [];
		const variantsCount = variants.length;
		// counter for assigning params to correct variant
		let counter = 0;
		// counter for assigning correct parameter name
		let paramCounter = 0;
		paramInputs.forEach((input) => {
			//check if params array for current variant exists
			if (!variantParams[counter]) {
				variantParams[counter] = [];
			}
			// add param with its value into variant´s params array
			variantParams[counter].push({ name: parameters[paramCounter].name, value: input.value });

			if (counter === variantsCount - 1) {
				counter = 0;
				++paramCounter;
			} else {
				++counter;
			}
		});

		return variantParams;
	}

	/**
	 * * Fill inputs with values of loaded article
	 */
	async function setData() {
		const productData = await getProduct(id);
		console.log(productData);
		setValue("manufacturer_id", productData.manufacturer_id);
		setValue("name", productData.name);
		setValue("description", productData.description);
		setValue("active", productData.active);
		setDetailText(productData.detail);
		setPickedCategories(productData.categories);
		setVariants(productData.variants);
		setImages(productData.images);
		let parametersArray = [];

		// set parameters array
		if (productData.variants[0].parameters?.length) {
			productData.variants[0].parameters.forEach((item, index) => {
				parametersArray.push({ name: item.name, p_order: index });
			});

			// set variants values for each parameter
			productData.variants.forEach((variant) => {
				variant.parameters.forEach((parameter, index) => {
					if (!parametersArray[index].values) {
						parametersArray[index].values = [];
					}
					parametersArray[index].values.push(parameter.value);
				});
			});
		}
		setParameters(parametersArray);
	}

	async function deleteHandler() {
		await remove("products", id, setMessage, "Produkt byl smazán", auth);
		navigate(`/dashboard/products`);
	}

	function deleteProduct() {
		setAlert({ id: id, question: "Smazat produkt?", positiveHandler: deleteHandler });
	}

	return (
		<form className={css.product} onSubmit={handleSubmit(onSubmit)}>
			<section className={css.basic_info}>
				<h2>Základní informace:</h2>
				<InputBox placeholder="Název" register={register} type="text" name="name" icon={faShoppingCart} isRequired={true} />
				<InputBox placeholder="Popisek" register={register} type="text" name="description" icon={faInfo} isRequired={true} />

				<div className={cssBasic.input_box}>
					<select defaultValue={"default"} {...register("manufacturer_id")}>
						<option value="default" disabled>
							-- Přiřadit výrobce --
						</option>
						{manufacturers &&
							manufacturers.map((el) => (
								<option key={el.id} value={el.id}>
									{el.name}
								</option>
							))}
					</select>
					<FontAwesomeIcon className={cssBasic.icon} icon={faCopyright} />
				</div>

				<div className={cssBasic.input_box}>
					<select defaultValue={"default"} {...register("categories")} onChange={chooseCategory}>
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

				<p>Produkt je viditelný: </p>
				<label className={css.switch}>
					<input type="checkbox" {...register("active")} />
					<span className={css.slider}></span>
				</label>
			</section>

			<Variants variants={variants} setVariants={setVariants} parameters={parameters} setParameters={setParameters} />

			<Parameters variants={variants} parameters={parameters} setParameters={setParameters} refTableParams={refTableParams} />

			<DetailText detailText={detailText} setDetailText={setDetailText} />

			<section className={css.images}>
				<Images images={images} auth={auth} setImages={setImages} register={register} setMessage={setMessage} />

				<div className={css.control_box}>
					<button>Uložit</button>
					<button type="button" className="blue_button">
						<FontAwesomeIcon className={css.btn_icon} icon={faEye} />
						Náhled produktu
					</button>
					{id && (
						<button type="button" className="red_button" onClick={deleteProduct}>
							Smazat
						</button>
					)}
				</div>
			</section>
		</form>
	);
}
