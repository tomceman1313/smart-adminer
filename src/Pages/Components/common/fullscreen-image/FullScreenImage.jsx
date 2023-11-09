/* eslint-disable jsx-a11y/alt-text */
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { motion } from "framer-motion";
import React, { useRef } from "react";
import { publicPath } from "../../../modules/BasicFunctions";

import css from "./FullScreenImage.module.css";

export default function FullScreenImage({ photos, close, start, path }) {
	const splide = useRef(null);

	return (
		<motion.section className={css.full_img} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
			<FontAwesomeIcon icon={faXmark} className={css.close} onClick={() => close()} />
			<Splide
				ref={splide}
				options={{
					height: "90vh",
					perPage: 1,
					perMove: 1,
					start: start ? start : 0,
					classes: {
						pagination: `splide__pagination pagination_blue_active_dot`,
						arrow: "splide__arrow sulicka_arrow",
					},
				}}
			>
				{photos &&
					photos.map((img, index) => (
						<SplideSlide key={`image-${index}`}>
							<div className={css.image_cont}>
								<img src={img?.name ? `${publicPath}/images/${path}/${img.name}` : img} loading="lazy" />
							</div>
						</SplideSlide>
					))}
			</Splide>
		</motion.section>
	);
}
