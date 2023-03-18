import ArticleImage from "./ArticleImage";
import css from "./Article.module.css";
import { deleteImage as deleteImageArticles } from "../../modules/ApiArticles";
import { deleteImage as deleteImageEvents } from "../../modules/ApiEvents";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const ImageList = ({ images, auth, setMessage, setImages, location }) => {
	const remove = (el) => {
		if (location === "articles") {
			deleteImageArticles(el.name, auth, setMessage);
		} else if (location === "events") {
			deleteImageEvents(el.name, auth, setMessage);
		}
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
