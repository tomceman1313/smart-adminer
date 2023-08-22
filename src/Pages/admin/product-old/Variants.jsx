import { useRef, useState } from "react";

import css from "./Product.module.css";
import Variant from "./Variant";

export default function Variants({ variants, setVariants, parameters, setParameters }) {
	const refName = useRef(null);
	const refPrice = useRef(null);
	const refInStock = useRef(null);

	const [usedNameMessage, setUsedNameMessage] = useState(null);

	const addVariant = () => {
		const variantAdded = [
			...variants,
			{ name: refName.current.value, price: refPrice.current.value, in_stock: refInStock.current.value, v_order: variants.length },
		];
		if (variants.filter((item) => item.name === refName.current.value).length > 0) {
			setUsedNameMessage(true);
			refName.current.value = "";
			refName.current.focus();
			setTimeout(() => {
				setUsedNameMessage(null);
			}, 5000);
			return;
		}

		let parametersUpdated = parameters.map((el) => {
			el.values.push("");
			return el;
		});
		setParameters(parametersUpdated);

		refName.current.value = "";
		refPrice.current.value = "";
		refInStock.current.value = "";
		setVariants(variantAdded.sort((a, b) => a.v_order - b.v_order));
	};

	return (
		<section className={css.variants}>
			<h2>Varianty:</h2>
			<ul>
				{variants.length > 0 && (
					<li className={css.table_head}>
						<label>Název</label>
						<label>Kusů skladem</label>
						<label>Cena</label>
					</li>
				)}
				{variants.length > 0 ? (
					variants.map((item) => (
						<Variant key={item.name} el={item} variants={variants} setVariants={setVariants} parameters={parameters} setParameters={setParameters} />
					))
				) : (
					<p>- Pro tento produkt nebyly zatím vytvořeny žádné varianty</p>
				)}
			</ul>
			<h3>Přidání varianty:</h3>
			<div>
				<input type="text" placeholder="Název" ref={refName} />
				<input type="number" placeholder="Kusů skladem" ref={refInStock} />
				<input type="number" placeholder="Cena" ref={refPrice} />

				<button type="button" onClick={addVariant}>
					Uložit
				</button>
				{usedNameMessage && <p>Jméno kategorie už je použito!</p>}
			</div>
		</section>
	);
}
