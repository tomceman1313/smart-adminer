import { useEffect, useState, useRef } from "react";
import Category from "../../Components/common/categories-component/Category";
import { getAll, getByCategory, remove, edit } from "../../modules/ApiFunctions";
import { multipleDelete } from "../../modules/ApiGallery";
import useAuth from "../../Hooks/useAuth";
import css from "./css/Gallery.module.css";
import NewPicture from "./NewPicture";
import ImageList from "./ImageList";
import { useParams, useNavigate } from "react-router-dom";
import { sliceDataBasedOnPageNumber } from "../../modules/BasicFunctions";
import { Helmet } from "react-helmet-async";
import ItemsController from "../../Components/common/items-controller/ItemsController";
import useInteraction from "../../Hooks/useInteraction";

export default function GalleryPage() {
	const auth = useAuth();
	const { page } = useParams();
	const navigate = useNavigate();
	const { setMessage } = useInteraction();

	const [images, setImages] = useState(null);
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const allLoadedImages = useRef([]);
	const [isMultiSelectionActive, setIsMultiSelectionActive] = useState(false);
	const selectedImages = useRef(new Map());

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Remove page number when selected category is changed
	useEffect(() => {
		navigate("/gallery/");
	}, [selectedCategory, navigate]);

	// Load only part of data based on page number
	useEffect(() => {
		sliceDataBasedOnPageNumber(allLoadedImages.current, 12, page, setImages);
	}, [page]);

	async function loadData() {
		const data = await getAll("gallery");
		allLoadedImages.current = data;
		sliceDataBasedOnPageNumber(data, 12, page, setImages);
		setSelectedCategory(null);
	}

	async function filterImagesByCategory(id) {
		const data = await getByCategory("gallery", id);
		allLoadedImages.current = data;
		sliceDataBasedOnPageNumber(data, 12, page, setImages);
		const _selectedCategory = categories.find((item) => item.id === id);
		setSelectedCategory(_selectedCategory);
	}

	async function editImageHandler(data) {
		await edit("gallery", data, setMessage, "Obrázek byl upraven", auth);
		loadData();
	}

	async function deleteImageHandler(id) {
		await remove("gallery", id, setMessage, "Obrázek byl smazán", auth);
		loadData();
	}

	async function deleteImagesHandler(ids) {
		await multipleDelete(ids, auth, setMessage);
		loadData();
		setIsMultiSelectionActive(false);
	}

	function resetFilter() {
		setSelectedCategory(null);
		loadData();
	}

	return (
		<div className={css.gallery}>
			<Helmet>
				<title>Galerie | SmartAdminer</title>
			</Helmet>
			<Category
				filterByCategory={filterImagesByCategory}
				categories={categories}
				setCategories={setCategories}
				apiClass="gallery"
				reloadData={loadData}
			/>
			<NewPicture auth={auth} setImages={setImages} categories={categories} />
			<ItemsController
				apiClass="gallery"
				setState={setImages}
				selectedCategory={selectedCategory}
				isMultiSelection={isMultiSelectionActive}
				deleteItems={deleteImagesHandler}
				resetFilter={resetFilter}
				selectedItems={selectedImages}
				toggleMultiSelectionActive={() => setIsMultiSelectionActive((prev) => !prev)}
				settingsConfig={{
					deleteQuestion: "Smazat vybrané fotky?",
					searchInput: "",
					multiSelection: true,
					allItemsText: "Veškeré fotky",
				}}
			/>
			<ImageList
				images={images}
				allLoadedImages={allLoadedImages}
				deleteImageHandler={deleteImageHandler}
				editImageHandler={editImageHandler}
				isMultiSelectionActive={isMultiSelectionActive}
				selectedImages={selectedImages}
			/>
		</div>
	);
}
