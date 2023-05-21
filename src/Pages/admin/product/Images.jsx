import React from "react";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { deleteImage } from "../../modules/ApiProducts";
import { useParams } from "react-router-dom";
import ProductImage from "./ProductImage";

import cssBasic from "../styles/Basic.module.css";
import css from "./Product.module.css";

export default function Images({ images, auth, setMessage, setImages, register }) {
	const { id } = useParams();
	const remove = (el) => {
		deleteImage(el.name, id, auth, setMessage);

		const index = images.indexOf(el);
		if (images.length === 1) {
			setImages(null);
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
	};

	return (
		<section className={css.images}>
			<h2>Obrázky</h2>
			<h3>Přidat obrázky:</h3>
			<div className={`${cssBasic.input_box}`}>
				<input type="file" accept="image/*" {...register("images")} multiple />
				<FontAwesomeIcon className={cssBasic.icon} icon={faImage} />
			</div>

			{images && (
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
								<ProductImage el={img} deleteImage={remove} />
							</SplideSlide>
						))}
					</Splide>
				</div>
			)}
		</section>
	);
}
