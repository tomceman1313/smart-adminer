import { useEffect, useState, useRef } from "react";
import Category from "../../Components/common/categories-component/Category";
import { getAll, getByCategory } from "../../modules/ApiFunctions";
import useAuth from "../../Hooks/useAuth";
import css from "./css/Gallery.module.css";
import NewPicture from "./NewPicture";
import Images from "./Images";
import { useParams, useNavigate } from "react-router-dom";
import { sliceDataBasedOnPageNumber } from "../../modules/BasicFunctions";
import { Helmet } from "react-helmet-async";

const Gallery = () => {
	const auth = useAuth();
	const { page } = useParams();
	const navigate = useNavigate();

	const [images, setImages] = useState(null);
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const allLoadedImages = useRef([]);

	// Remove page number when selected category is changed
	useEffect(() => {
		navigate("/gallery/");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedCategory]);

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
		const categoryName = categories.filter((item) => item.id === id);
		setSelectedCategory(categoryName[0].name);
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
