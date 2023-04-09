import { useEffect, useState } from "react";
import Category from "../../Components/common/categories-component/Category";

import useAuth from "../../Hooks/useAuth";

import css from "./css/Gallery.module.css";
import NewPicture from "./NewPicture";
import Images from "./Images";

const Gallery = () => {
	const auth = useAuth();
	const [images, setImages] = useState(null);
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Galerie";
		document.getElementById("banner-desc").innerHTML = "Správa fotek v galerii a tvorba kategorií pro jejich rozřazení";
	}, []);

	return (
		<div className={css.gallery}>
			<Category
				setState={setImages}
				setSelectedCategory={setSelectedCategory}
				categories={categories}
				setCategories={setCategories}
				apiClass="gallery"
			/>
			<NewPicture auth={auth} setImages={setImages} categories={categories} />
			<Images images={images} setImages={setImages} auth={auth} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
		</div>
	);
};

export default Gallery;
