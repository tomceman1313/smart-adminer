import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import css from "./InfoBoxes.module.css";

export default function InfoBox({
	title,
	leftLabel,
	leftCounter,
	rightLabel,
	rightCounter,
	linkText,
	linkLocation,
	delay,
}) {
	return (
		<motion.div
			className={css.box}
			initial={{ scale: 0 }}
			animate={{ scale: 1 }}
			transition={{ delay: delay }}
		>
			<h4>{title}</h4>
			<div className={css.box_section}>
				<span>
					<label>{leftLabel}</label>
					<b className={css.count}>{leftCounter}</b>
				</span>

				<span>
					<label>{rightLabel}</label>
					<b className={css.count}>{rightCounter}</b>
				</span>
			</div>

			<Link to={linkLocation}>{linkText}</Link>
		</motion.div>
	);
}
