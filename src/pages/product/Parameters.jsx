import { faIndent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState, useEffect } from "react";
import useInteraction from "../../hooks/useInteraction";

import Parameter from "./inner-components/Parameter";
import css from "./styles/Parameters.module.css";
import { createUniqId } from "../../modules/BasicFunctions";
import { useTranslation } from "react-i18next";
import SortableList from "../../components/common/sortable/SortableList";
import SortableItem from "../../components/common/sortable/SortableItem";

export default function Parameters({ parameters, setParameters, variants }) {
	const { t } = useTranslation("products");
	const { setMessage } = useInteraction();
	const newParameterRef = useRef(null);
	const addToAllRef = useRef(null);

	const [activeVariant, setActiveVariant] = useState(variants[0]?.name);
	const [activeParamsIndex, setActiveParamsIndex] = useState(0);
	const [activeParams, setActiveParams] = useState(parameters[0].params);

	//change activeVariant to first in list after some variant is changed
	useEffect(() => {
		//console.log(variants);
		changeVariant(variants[0]?.name);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [variants]);

	const createNewParam = () => {
		if (addToAllRef.current.checked) {
			createNewParamToAll();
			return;
		}

		if (
			parameters[activeParamsIndex].params.find(
				(item) => item.name === newParameterRef.current.value
			)
		) {
			setMessage({ text: t("messageParameterAlreadyExists"), action: "alert" });
			return;
		}
		const updatedParams = JSON.parse(JSON.stringify(parameters));

		updatedParams[activeParamsIndex].params.push({
			id: createUniqId(),
			name: newParameterRef.current.value,
			value: "",
			p_order: parameters[activeParamsIndex].params.length,
		});
		setParameters(updatedParams);
		//console.log(updatedParams[activeParamsIndex].params);
		setActiveParams(updatedParams[activeParamsIndex].params);
		newParameterRef.current.value = "";
	};

	function createNewParamToAll() {
		const updatedParameters = JSON.parse(JSON.stringify(parameters));
		updatedParameters.map((parameter) => {
			if (
				!parameter.params.find(
					(item) => item.name === newParameterRef.current.value
				)
			) {
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
		newParameterRef.current.value = "";
	}

	function changeVariant(variantName) {
		setActiveVariant(variantName);
		const _activeParams = parameters.findIndex(
			(item) => item.variant === variantName
		);
		if (_activeParams >= 0) {
			setActiveParamsIndex(_activeParams);
			setActiveParams(parameters[_activeParams].params);
		}
	}

	function createParamsPattern() {
		const patternParams = [];
		parameters[activeParamsIndex]?.params.forEach((param) => {
			patternParams.push(param.name);
		});
	}

	function orderParametersHandler(parametersOrdered) {
		const newOrder = activeParams.map((parameter, index) => {
			return { ...parameter, p_order: index };
		});
		setActiveParams(newOrder);
		let updatedParams = JSON.parse(JSON.stringify(parameters));
		updatedParams[activeParamsIndex].params = newOrder;
		console.log(updatedParams);
		setParameters(updatedParams);
	}

	return (
		<>
			<section className={css.parameters}>
				<div className={css.variant_tabs}>
					{variants.map((el) => (
						<label
							key={`variant-tab-${el.name}`}
							className={activeVariant === el.name ? css.active : ""}
							onClick={() => changeVariant(el.name)}
						>
							{el.name}
						</label>
					))}
				</div>

				<h2>{t("headerParameters")}</h2>

				<SortableList
					items={activeParams}
					setState={setActiveParams}
					overlayElement={OverlayParameter}
					sortCallbackFunction={orderParametersHandler}
				>
					<ul>
						{parameters &&
							activeParams.map((el) => (
								<SortableItem
									key={`p-${el.id}`}
									className={css.parameter}
									item={el}
								>
									<Parameter
										el={el}
										activeIndex={activeParamsIndex}
										parameters={parameters}
										setParameters={setParameters}
									/>
								</SortableItem>
							))}
					</ul>
				</SortableList>

				<h3>{t("headerAddParameter")}</h3>
				<div className={css.add_parameter}>
					<FontAwesomeIcon icon={faIndent} />
					<input
						type="text"
						placeholder={t("placeholderParameterName")}
						ref={newParameterRef}
					/>
					<button type="button" onClick={createNewParam}>
						{t("buttonAdd")}
					</button>
				</div>
				<div className={css.add_to_all}>
					<input type="checkbox" id="add-to-all" ref={addToAllRef} />
					<label htmlFor="add-to-all">{t("checkboxAddToAll")}</label>
				</div>

				{/* <div className={css.pattern_controls}>
					<button type="button">Přidat parametry ze vzoru</button>
					<button type="button" onClick={createParamsPattern}>
						Vytvořit vzor
					</button>
				</div> */}
			</section>
		</>
	);
}

function OverlayParameter(variant, parameters) {
	return (
		<li className={css.parameter}>
			<Parameter
				el={variant}
				parameters={parameters}
				setParameters={() => {}}
				activeIndex={0}
			/>
		</li>
	);
}
