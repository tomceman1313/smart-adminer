import {
	faCopyright,
	faHashtag,
	faInfo,
	faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import InputBox from "../../components/basic/InputBox";
import Select from "../../components/basic/select/Select";
import Switch from "../../components/basic/switch/Switch";
import cssBasic from "../../components/styles/Basic.module.css";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import useInteraction from "../../hooks/useInteraction";
import { getCategories } from "../../modules/ApiCategories";
import { getManufacturers } from "../../modules/ApiProductManufacturers";
import { convertBase64 } from "../../modules/BasicFunctions";
import {
	checkInnerImage,
	findDeletedImages,
	formatBody,
} from "../../modules/TextEditorFunctions";
import DetailText from "./DetailText";
import Images from "./Images";
import Parameters from "./Parameters";
import Variants from "./Variants";
import css from "./styles/Product.module.css";
import warningToast from "../../components/common/warning-toast/WarningToast";

//TODO: usequery refactor
export default function Product() {
	const { t } = useTranslation("products");
	const { id } = useParams();
	let location = useLocation();
	const navigate = useNavigate();
	const { get, create, edit, remove, checkNameAvailability } =
		useBasicApiFunctions();
	const { setAlert } = useInteraction();

	const [categories, setCategories] = useState(null);
	const [manufacturers, setManufacturers] = useState(null);
	const [pickedCategories, setPickedCategories] = useState([]);
	const [variants, setVariants] = useState([]);
	const [parameters, setParameters] = useState([]);
	const [detailText, setDetailText] = useState("");
	const [product, setProduct] = useState(null);
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
		setProduct(productData);
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
			warningToast(t("messageNoVariant"));
			return;
		}

		if ((images?.length === 0 || images === null) && data.images.length === 0) {
			warningToast(t("messageNoImage"));
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
			if (product.name !== data.name && !isAvailable) {
				warningToast(t("messageProductExists"));
				return;
			}
			data.id = id;
			data.images = images;
			data.deletedImages = findDeletedImages(detailText, originalImages);
			await edit("products", data, t("positiveTextProductUpdated"));
			reset();
			setData();
		} else {
			if (!isAvailable) {
				warningToast(t("messageProductExists"));
				return;
			}
			await create("products", data, t("positiveTextProductCreated"));
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
		const name = categories.filter(
			(item) => item.id === parseInt(e.target.value)
		);
		const alreadyIn = pickedCategories.find(
			(item) => item.id === parseInt(e.target.value)
		);
		setValue("categories", "default");
		if (alreadyIn) {
			return;
		}

		if (name.length !== 0) {
			setPickedCategories((prev) => [...prev, name[0]]);
		}
	}

	function removeFromPicked(e) {
		const removed = pickedCategories.filter(
			(item) => item.id !== parseInt(e.target.id)
		);
		setPickedCategories(removed);
	}

	async function deleteHandler() {
		await remove("products", id, t("positiveTextProductDeleted"));
		navigate(`/products`);
	}

	function deleteProduct() {
		setAlert({
			id: id,
			question: t("alertDelete"),
			positiveHandler: deleteHandler,
		});
	}

	return (
		<>
			<Helmet>
				<title>
					{product?.name ? product.name : t("htmlTitleProduct")} | SmartAdminer
				</title>
			</Helmet>
			{manufacturers ? (
				<form className={css.product} onSubmit={handleSubmit(onSubmit)}>
					<section className={css.basic_info}>
						<h2>{t("headerBasicInfo")}</h2>
						<InputBox
							placeholder={t("placeholderTitle")}
							register={register}
							type="text"
							name="name"
							icon={faShoppingCart}
							isRequired
						/>
						<InputBox
							placeholder={t("placeholderDescription")}
							register={register}
							type="text"
							name="description"
							icon={faInfo}
							isRequired
						/>
						<Select
							name="manufacturer_id"
							options={manufacturers}
							icon={faCopyright}
							register={register}
							placeholderValue={t("placeholderManufacturer")}
						/>

						<div className={cssBasic.input_box}>
							<select
								defaultValue={"default"}
								{...register("categories")}
								onChange={chooseCategory}
							>
								<option value="default" disabled>
									{t("placeholderCategory")}
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
						<Switch
							name="active"
							register={register}
							label={t("placeholderIsVisible")}
						/>
					</section>

					<Variants
						variants={variants}
						setVariants={setVariants}
						parameters={parameters}
						setParameters={setParameters}
					/>
					{variants.length > 0 && (
						<Parameters
							parameters={parameters}
							setParameters={setParameters}
							variants={variants}
						/>
					)}

					<DetailText
						detailText={detailText}
						setDetailText={setDetailText}
						key={detailText ? "filled" : "empty"}
					/>

					<section className={css.images}>
						<Images images={images} setImages={setImages} register={register} />
						<div className={css.control_box}>
							<button>{id ? t("buttonSave") : t("buttonCreate")}</button>
							{/* <button type="button" className="blue_button">
					<FontAwesomeIcon className={css.btn_icon} icon={faEye} />
					Náhled produktu
				</button> */}
							{id && (
								<button
									type="button"
									className="red_button"
									onClick={deleteProduct}
								>
									{t("buttonDelete")}
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
