import { faIndent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState, useEffect } from "react";
import useInteraction from "../../Hooks/useInteraction";

import Parameter from "./inner-components/Parameter";
import css from "./styles/Parameters.module.css";
import { createUniqId } from "../../modules/BasicFunctions";

export default function Parameters({ parameters, setParameters, variants }) {
	const { setMessage } = useInteraction();
	const newParameterRef = useRef(null);
	const addToAllRef = useRef(null);

	const [activeVariant, setActiveVariant] = useState(variants[0]?.name);
	const [activeParamsIndex, setActiveParamsIndex] = useState(0);

	//change activeVariant to first in list after some variant is changed
	useEffect(() => {
		changeVariant(variants[0]?.name);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [variants]);

	const createNewParam = () => {
		if (addToAllRef.current.checked) {
			createNewParamToAll();
			return;
		}

		if (parameters[activeParamsIndex].params.find((item) => item.name === newParameterRef.current.value)) {
			setMessage({ text: "Parametr již je vložen", action: "alert" });
			return;
		}

		parameters[activeParamsIndex].params.push({
			id: createUniqId(),
			name: newParameterRef.current.value,
			value: "",
			p_order: parameters[activeParamsIndex].params.length,
		});
		setParameters([...parameters]);
		console.log(parameters);
		newParameterRef.current.value = "";
	};

	function createNewParamToAll() {
		const updatedParameters = JSON.parse(JSON.stringify(parameters));
		updatedParameters.map((parameter) => {
			if (!parameter.params.find((item) => item.name === newParameterRef.current.value)) {
				parameter.params.push({
					id: createUniqId(),
					name: newParameterRef.current.value,
					value: "",
					p_order: parameter.params.length,
				});
			}
			return parameter;
		});

		setParameters(updatedParameters);
		console.log(updatedParameters);
		newParameterRef.current.value = "";
	}

	function changeVariant(variantName) {
		setActiveVariant(variantName);
		const _activeParams = parameters.findIndex((item) => item.variant === variantName);
		if (_activeParams >= 0) {
			setActiveParamsIndex(_activeParams);
		}
	}

	function createParamsPattern() {
		const patternParams = [];
		parameters[activeParamsIndex]?.params.forEach((param) => {
			patternParams.push(param.name);
		});

		console.log(patternParams);
	}

	return (
		<>
			<section className={css.parameters}>
				<div className={css.variant_tabs}>
					{variants.map((el) => (
						<label key={`variant-tab-${el.name}`} className={activeVariant === el.name ? css.active : ""} onClick={() => changeVariant(el.name)}>
							{el.name}
						</label>
					))}
				</div>

				<h2>Parametry:</h2>

				<ul>
					{parameters &&
						parameters[activeParamsIndex]?.params.map((el) => (
							<Parameter key={`p-${el.id}`} el={el} activeIndex={activeParamsIndex} parameters={parameters} setParameters={setParameters} />
						))}
				</ul>

				<h3>Přidání parametru:</h3>
				<div className={css.add_parameter}>
					<FontAwesomeIcon icon={faIndent} />
					<input type="text" placeholder="Název parametru" ref={newParameterRef} />
					<button type="button" onClick={createNewParam}>
						Přidat
					</button>
				</div>
				<div className={css.add_to_all}>
					<input type="checkbox" id="add-to-all" ref={addToAllRef} />
					<label htmlFor="add-to-all">Přidat parametr všem variantám</label>
				</div>

				<div className={css.pattern_controls}>
					<button type="button">Přidat parametry ze vzoru</button>
					<button type="button" onClick={createParamsPattern}>
						Vytvořit vzor
					</button>
				</div>
			</section>
		</>
	);
}
