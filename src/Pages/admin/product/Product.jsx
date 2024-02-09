import { faHashtag, faInfo, faShoppingCart, faEye, faCopyright } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import InputBox from "../../Components/basic/InputBox";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { getCategories } from "../../modules/ApiCategories";
import { create, edit, remove, checkNameAvailability, get } from "../../modules/ApiFunctions";
import { getManufacturers } from "../../modules/ApiProductManufacturers";
import { convertBase64 } from "../../modules/BasicFunctions";
import { Helmet } from "react-helmet-async";
import cssBasic from "../styles/Basic.module.css";
import DetailText from "./DetailText";
import Images from "./Images";
import css from "./styles/Product.module.css";
import Variants from "./Variants";
import Parameters from "./Parameters";
import { formatBody, checkInnerImage, findDeletedImages } from "../../modules/TextEditorFunctions";
import Switch from "../../Components/basic/switch/Switch";
import Select from "../../Components/basic/select/Select";

export default function Product() {
	const auth = useAuth();
	const { id } = useParams();
	let location = useLocation();
	const navigate = useNavigate();
	const { setMessage, setAlert } = useInteraction();

	const [categories, setCategories] = useState(null);
	const [manufacturers, setManufacturers] = useState(null);
	const [pickedCategories, setPickedCategories] = useState([]);
	const [variants, setVariants] = useState([]);
	const [parameters, setParameters] = useState([]);
	const [detailText, setDetailText] = useState("");
	const originalProduct = useRef({});
	const originalImages = useRef([]);
	const [images, setImages] = useState(null);
	const { register, handleSubmit, setValue, reset } = useForm();

	useEffect(() => {
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

	async function setData() {
		const productData = await get("products", id);
		originalProduct.current = productData;
		setValue("manufacturer_id", productData.manufacturer_id);
		setValue("name", productData.name);
		setValue("description", productData.description);
		setValue("active", productData.active);

		setDetailText(productData.detail);
		setPickedCategories(productData.categories);
		setVariants(productData.variants);
		setParameters(productData.parameters);

		originalImages.current = checkInnerImage(productData.detail);
		setImages(productData.images.filter((img) => img.i_order >= 0));
	}

	async function onSubmit(data) {
		const isAvailable = await checkNameAvailability("products", data.name);

		if (variants.length === 0) {
			setMessage({ action: "alert", text: "Produkt musí obsahovat minimálně jednu variantu" });
			return;
		}

		if ((images?.length === 0 || images === null) && data.images.length === 0) {
			console.log(images);
			setMessage({ action: "alert", text: "Produkt musí obsahovat minimálně jeden obrázek" });
			return;
		}

		const variantsWithParams = await variants.map((item) => {
			const params = parameters.find((param) => param.variant === item.name);
			item.parameters = params;
			return item;
		});

		data.variants = variantsWithParams;
		const detailInnerImages = [];
		data.detail = await formatBody(detailText, detailInnerImages, "products");
		data.innerImages = detailInnerImages;

		let order = images?.length ? images?.length : 0;
		const imagesArray = [];
		for (const file of data.images) {
			const base64 = await convertBase64(file);
			imagesArray.push({ file: base64, order: order });
			++order;
		}
		data.new_images = imagesArray;

		data.categories = pickedCategories;
		if (id) {
			if (originalProduct.current.name !== data.name && !isAvailable) {
				setMessage({ action: "alert", text: "Produkt s tímto názvem již existuje" });
				return;
			}
			data.id = id;
			data.images = images;
			data.deletedImages = findDeletedImages(detailText, originalImages);
			await edit("products", data, setMessage, "Produkt upraven", auth);
			reset();
			setData();
		} else {
			if (!isAvailable) {
				setMessage({ action: "alert", text: "Produkt s tímto názvem již existuje" });
				return;
			}
			console.log(data);
			await create("products", data, setMessage, "Produkt vložen", auth);
			navigate(`/products`);
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

	async function deleteHandler() {
		await remove("products", id, setMessage, "Produkt byl smazán", auth);
		navigate(`/products`);
	}

	function deleteProduct() {
		setAlert({ id: id, question: "Smazat produkt?", positiveHandler: deleteHandler });
	}

	return (
		<>
			<Helmet>
				<title>{id ? "Produkt" : "Nový produkt"} | SmartAdminer</title>
			</Helmet>
			{manufacturers ? (
				<form className={css.product} onSubmit={handleSubmit(onSubmit)}>
					<section className={css.basic_info}>
						<h2>Základní informace:</h2>
						<InputBox placeholder="Název" register={register} type="text" name="name" icon={faShoppingCart} isRequired={true} />
						<InputBox placeholder="Popisek" register={register} type="text" name="description" icon={faInfo} isRequired={true} />
						<Select name="manufacturer_id" options={manufacturers} icon={faCopyright} register={register} placeholderValue="-- Přiřadit výrobce --" />

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
						<Switch name="active" register={register} label="Produkt je viditelný:" />
					</section>

					<Variants variants={variants} setVariants={setVariants} parameters={parameters} setParameters={setParameters} />
					{variants.length > 0 && <Parameters parameters={parameters} setParameters={setParameters} variants={variants} />}

					{detailText && <DetailText detailText={detailText} setDetailText={setDetailText} />}

					<section className={css.images}>
						<Images images={images} auth={auth} setImages={setImages} register={register} setMessage={setMessage} />
						<div className={css.control_box}>
							<button>Uložit</button>
							{/* <button type="button" className="blue_button">
					<FontAwesomeIcon className={css.btn_icon} icon={faEye} />
					Náhled produktu
				</button> */}
							{id && (
								<button type="button" className="red_button" onClick={deleteProduct}>
									Smazat
								</button>
							)}
						</div>
					</section>
				</form>
			) : (
				<h3>Načítání produktu</h3>
			)}
		</>
	);
}
