import React from "react";
import css from "./FilterNotifier.module.css";
import { AnimatePresence, motion } from "framer-motion";

export default function FilterNotifier({ selectedCategory, resetHandler }) {
	return (
		<AnimatePresence>
			{selectedCategory && (
				<motion.div className={css.filter} initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} exit={{ opacity: 0, scaleY: 0 }}>
					<div>
						<label>Vybraná kategorie: </label>
						<label>{selectedCategory}</label>
					</div>
					<button onClick={resetHandler}>Resetovat filtr</button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
