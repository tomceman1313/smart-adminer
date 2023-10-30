import { useRef } from "react";
import useInteraction from "../../Hooks/useInteraction";

import Variant from "./inner-components/Variant";
import css from "./styles/Product.module.css";

export default function Variants({ variants, setVariants, parameters, setParameters }) {
	const { setMessage } = useInteraction();

	const refName = useRef(null);
	const refPrice = useRef(null);
	const refInStock = useRef(null);

	const addVariant = () => {
		const variantAdded = [
			...variants,
			{
				name: refName.current.value,
				price: refPrice.current.value,
				in_stock: refInStock.current.value,
				v_order: variants.length,
				id: variants.length,
			},
		];
		if (variants.filter((item) => item.name === refName.current.value).length > 0) {
			setMessage({ action: "alert", text: "Varianta se shodným názvem již je vytvořena." });
			refName.current.value = "";
			refName.current.focus();
			return;
		}

		if (refInStock.current.value === "") {
			setMessage({ action: "alert", text: "Varianta musí obsahovat počet kusů na skladě." });
			refInStock.current.focus();
			return;
		}

		if (refPrice.current.value === "") {
			setMessage({ action: "alert", text: "Varianta musí mít definovanou cenu." });
			refPrice.current.focus();
			return;
		}

		let parametersUpdated = [...parameters, { variant: refName.current.value, params: [] }];
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
						<label></label>
					</li>
				)}
				{variants.length > 0 ? (
					variants.map((item) => (
						<Variant key={`var-${item.id}-${item.v_order}`} el={item} variants={variants} setVariants={setVariants} setParameters={setParameters} />
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
					Přidat
				</button>
			</div>
		</section>
	);
}
