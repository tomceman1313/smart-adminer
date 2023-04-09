import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndent } from "@fortawesome/free-solid-svg-icons";

import css from "./Product.module.css";
import Parameter from "./Parameter";

export default function Parameters({ variants, parameters, setParameters, refTableParams }) {
	const refNewParameter = useRef(null);

	const [paramIsUsed, setParamIsUsed] = useState(false);

	const createNewParam = () => {
		if (parameters.filter((item) => item.name === refNewParameter.current.value).length > 0) {
			setParamIsUsed(true);
			setTimeout(() => {
				setParamIsUsed(false);
			}, 5000);
			return;
		}

		setParameters([...parameters, { name: refNewParameter.current.value, p_order: parameters.length }]);
		refNewParameter.current.value = "";
	};

	return (
		<section className={css.parameters}>
			<h2>Parametry</h2>
			<ul>
				{parameters && parameters.map((el) => <Parameter key={`p-${el.name}`} el={el} parameters={parameters} setParameters={setParameters} />)}
			</ul>

			<h3>Přidání parametru:</h3>
			<div className={css.add_parameter}>
				<FontAwesomeIcon icon={faIndent} />
				<input type="text" placeholder="Název parametru" ref={refNewParameter} />
				<button type="button" onClick={createNewParam}>
					Přidat
				</button>
			</div>
			{paramIsUsed && <p>Název parametru je již vložen</p>}

			{variants.length > 0 ? (
				<div className={css.table_cont}>
					<table>
						<thead>
							<tr>
								<th></th>
								{variants.map((el) => (
									<th key={el.name}>{el.name}</th>
								))}
							</tr>
						</thead>

						<tbody ref={refTableParams}>
							{parameters &&
								parameters.map((el) => (
									<tr key={el.name}>
										<td>
											<label>{el.name}</label>
										</td>
										{variants.map((el) => (
											<td key={`value${el.name}`}>
												<input type="text" placeholder="hodnota" />
											</td>
										))}
									</tr>
								))}
						</tbody>
					</table>
				</div>
			) : (
				<p>Pro přidání parametrů vytvořte alespoň jednu variantu produktu</p>
			)}
		</section>
	);
}
