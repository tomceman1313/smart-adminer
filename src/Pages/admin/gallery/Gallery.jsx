import { useEffect, useState, useRef } from "react";
import Category from "../../Components/common/categories-component/Category";
import { getAll } from "../../modules/ApiFunctions";
import useAuth from "../../Hooks/useAuth";
import css from "./css/Gallery.module.css";
import NewPicture from "./NewPicture";
import Images from "./Images";
import { useParams, useNavigate } from "react-router-dom";
import { getByCategory } from "../../modules/ApiGallery";
import { sliceDataBasedOnPageNumber } from "../../modules/BasicFunctions";

const Gallery = () => {
	const auth = useAuth();
	const { page } = useParams();
	const navigate = useNavigate();

	const [images, setImages] = useState(null);
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const allLoadedImages = useRef([]);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Galerie";
		document.getElementById("banner-desc").innerHTML = "Správa fotek v galerii a tvorba kategorií pro jejich rozřazení";
	}, []);

	useEffect(() => {
		navigate("/dashboard/gallery/");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCategory]);

	useEffect(() => {
		sliceDataBasedOnPageNumber(allLoadedImages.current, 12, page, setImages);
	}, [page]);

	async function loadData() {
		const data = await getAll("gallery", auth);
		allLoadedImages.current = data;
		sliceDataBasedOnPageNumber(data, 12, page, setImages);
	}

	async function filterImagesByCategory(id) {
		const data = await getByCategory(id, auth);
		allLoadedImages.current = data;
		sliceDataBasedOnPageNumber(data, 12, page, setImages);
		const categoryName = categories.filter((item) => item.id === id);
		setSelectedCategory(categoryName[0].name);
	}

	return (
		<div className={css.gallery}>
			<Category filterByCategory={filterImagesByCategory} categories={categories} setCategories={setCategories} apiClass="gallery" />
			<NewPicture auth={auth} setImages={setImages} categories={categories} />
			<Images
				images={images}
				loadData={loadData}
				allLoadedImages={allLoadedImages}
				auth={auth}
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
			/>
		</div>
	);
};

export default Gallery;
