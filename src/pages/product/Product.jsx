import {
	faCopyright,
	faInfo,
	faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import InputBox from "../../components/basic/InputBox";
import CategorySelector from "../../components/basic/category-selector/CategorySelector";
import Select from "../../components/basic/select/Select";
import SubmitButton from "../../components/basic/submit-button/SubmitButton";
import Switch from "../../components/basic/switch/Switch";
import warningToast from "../../components/common/warning-toast/WarningToast";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import {
	useCreate,
	useDelete,
	useGet,
	useGetAll,
	useUpdate,
} from "../../hooks/api/useCRUD";
import useInteraction from "../../hooks/useInteraction";
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

export default function Product() {
	const { t } = useTranslation("products", "errors");
	const { id } = useParams();
	const navigate = useNavigate();

	const { checkNameAvailability } = useBasicApiFunctions();
	const { setAlert } = useInteraction();

	const [selectedCategories, setSelectedCategories] = useState([]);
	const [variants, setVariants] = useState([]);
	const [parameters, setParameters] = useState([]);
	const [detailText, setDetailText] = useState("");
	//const [product, setProduct] = useState(null);
	const originalImages = useRef([]);
	const [images, setImages] = useState(null);
	const { register, handleSubmit, setValue, reset } = useForm();

	const { data: product } = useGet(
		"products",
		id,
		["product"],
		t("errors:errorFetchProduct"),
		!!id
	);

	const { data: categories } = useGetAll(
		"products/categories",
		null,
		["categories"],
		t("errors:errorFetchCategories")
	);

	const { data: manufacturers } = useGetAll(
		"products/manufacturers",
		null,
		["manufacturers"],
		t("errors:errorFetchManufacturers")
	);

	const { mutateAsync: create } = useCreate(
		"products",
		t("positiveTextProductUpdated"),
		t("errors:errorCRUDOperation"),
		["product"]
	);

	const { mutateAsync: update, status } = useUpdate(
		"products",
		t("positiveTextProductUpdated"),
		t("errors:errorCRUDOperation"),
		["product"]
	);

	const { mutateAsync: remove } = useDelete(
		"products",
		t("positiveTextProductUpdated"),
		t("errors:errorCRUDOperation"),
		null
	);

	useEffect(() => {
		if (id && product) {
			setData();
		} else {
			reset();
			setVariants([]);
			setParameters([]);
			setDetailText("");
			setSelectedCategories([]);
			setImages(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, product]);

	async function setData() {
		setValue("manufacturer_id", product.manufacturer_id);
		setValue("name", product.name);
		setValue("description", product.description);
		setValue("active", product.active);

		setDetailText(product.detail);
		setSelectedCategories(product.categories);
		setVariants(product.variants);
		setParameters(product.parameters);

		originalImages.current = checkInnerImage(product.detail);
		setImages(product.images.filter((img) => img.i_order >= 0));
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

		data.categories = selectedCategories;
		if (id) {
			if (product.name !== data.name && !isAvailable) {
				warningToast(t("messageProductExists"));
				return;
			}
			data.id = id;
			data.images = images;
			data.deletedImages = findDeletedImages(detailText, originalImages);
			await update(data);
			reset();
			setData();
		} else {
			if (!isAvailable) {
				warningToast(t("messageProductExists"));
				return;
			}
			await create(data);
			navigate(`/products`);
		}
	}

	async function deleteHandler() {
		await remove(id);
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
					<section className={`${css.basic_info} half-section`}>
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

						<CategorySelector
							categories={categories}
							selectedCategories={selectedCategories}
							setSelectedCategories={setSelectedCategories}
							placeholder={t("placeholderCategory")}
						/>
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
							<SubmitButton
								status={status}
								value={id ? t("buttonSave") : t("buttonCreate")}
							/>
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
