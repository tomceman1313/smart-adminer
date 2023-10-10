import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import useAuth from "../../Hooks/useAuth";
import useInteraction from "../../Hooks/useInteraction";
import { deleteImage } from "../../modules/ApiFunctions";
import css from "./Article.module.css";
import ArticleImage from "./ArticleImage";

const ImageList = ({ images, setImages, location }) => {
	const auth = useAuth();
	const { setMessage } = useInteraction();
	const remove = (el) => {
		deleteImage(location, el.name, auth, setMessage);
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
