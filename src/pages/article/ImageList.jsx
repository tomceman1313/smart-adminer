import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { useParams } from "react-router-dom";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import ArticleImage from "./ArticleImage";

import css from "./Article.module.css";
//TODO: Kontrola toastu při smazání obrázku
const ImageList = ({ images, setImages, location }) => {
	const { id } = useParams();
	const { deleteImage } = useBasicApiFunctions();

	const remove = (el) => {
		if (!id) {
			throw Error("Source id is missing");
		}
		deleteImage(location, id, el.id);
		const index = images.indexOf(el);
		if (images.length === 1) {
			setImages(null);
			return;
		}

		if (index > -1) {
			setImages(images.filter((img) => img.name !== el.name));
		}
	};

	return (
		<div className={css.image_list}>
			<Splide
				className={css.splide}
				options={{
					perPage: 4,
					height: "auto",
					rewind: true,
				}}
			>
				{images.map((img) => (
					<SplideSlide key={img.id} className={css.slide}>
						<ArticleImage el={img} deleteImage={remove} location={location} />
					</SplideSlide>
				))}
			</Splide>
		</div>
	);
};

export default ImageList;
