import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useParams } from "react-router-dom";
import ProductImage from "./inner-components/ProductImage";

import { useTranslation } from "react-i18next";
import cssBasic from "../../components/styles/Basic.module.css";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import useViewport from "../../hooks/useViewport";
import css from "./styles/Images.module.css";

export default function Images({ images, setImages, register }) {
	const { id } = useParams();
	const { t } = useTranslation("products");
	const { deleteImage } = useBasicApiFunctions();
	const { width } = useViewport();

	function changeOrder(movedImage, direction) {
		let updatedImages = structuredClone(images);
		if (direction === "left") {
			if (movedImage.i_order !== 0) {
				const indexOfMovedImage = updatedImages.findIndex(
					(obj) => obj.id === movedImage.id
				);
				const imageOnTargetPosition = updatedImages[indexOfMovedImage - 1];
				--movedImage.i_order;
				++imageOnTargetPosition.i_order;
				updatedImages[indexOfMovedImage - 1] = movedImage;
				updatedImages[indexOfMovedImage] = imageOnTargetPosition;
				setImages(updatedImages);
			}
		}

		if (direction === "right") {
			if (movedImage.i_order !== updatedImages.length - 1) {
				const indexOfMovedImage = updatedImages.findIndex(
					(obj) => obj.id === movedImage.id
				);
				const imageOnTargetPosition = updatedImages[indexOfMovedImage + 1];
				++movedImage.i_order;
				--imageOnTargetPosition.i_order;
				updatedImages[indexOfMovedImage + 1] = movedImage;
				updatedImages[indexOfMovedImage] = imageOnTargetPosition;
				setImages(updatedImages);
			}
		}
	}

	async function remove(el) {
		await deleteImage("products", id, el.id);

		const index = images.indexOf(el);
		if (images.length === 1) {
			setImages([]);
			return;
		}
		if (index > -1) {
			let updatedImages = images.filter((img) => img.name !== el.name);
			let sortedImages = updatedImages.map((img) => {
				if (img.i_order !== 0) {
					img.i_order -= 1;
				}
				return img;
			});
			setImages(sortedImages);
		}
	}

	return (
		<div className={css.images}>
			<h2>{t("headerImages")}</h2>
			<h3>{t("headerAddImages")}</h3>
			<div className={`${cssBasic.input_box}`}>
				<input type="file" accept="image/*" {...register("images")} multiple />
				<FontAwesomeIcon className={cssBasic.icon} icon={faImage} />
			</div>

			{images && (
				<div className={css.image_list}>
					<Splide
						className={css.splide}
						options={{
							perPage: width > 700 ? 4 : 2,
							height: "auto",
							rewind: true,
						}}
					>
						{images.map((img) => (
							<SplideSlide key={img.id} className={css.slide}>
								<ProductImage
									el={img}
									deleteImage={remove}
									changeOrder={changeOrder}
								/>
							</SplideSlide>
						))}
					</Splide>
				</div>
			)}
		</div>
	);
}
