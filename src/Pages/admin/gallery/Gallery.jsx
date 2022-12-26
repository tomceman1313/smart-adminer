import { useEffect, useState } from "react";
import Category from "./Category";

import useAuth from "../../Hooks/useAuth";

import css from "./Gallery.module.css";

const Gallery = () => {
	const [photos, setPhotos] = useState(null);
	const auth = useAuth();

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Galerie";
		document.getElementById("banner-desc").innerHTML = "Správa fotek v galerii a tvorba kategorií pro jejich rozřazení";
	}, []);

	return (
		<div className={css.gallery}>
			<Category auth={auth} />
		</div>
	);
};

export default Gallery;
