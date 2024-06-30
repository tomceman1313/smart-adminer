import {
	faArrowDown,
	faArrowUp,
	faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

import css from "../styles/Parameters.module.css";
import { useTranslation } from "react-i18next";
import { DragHandle } from "../../../components/common/sortable/DragHandle";

const Parameter = ({ el, parameters, setParameters, activeIndex }) => {
	const { t } = useTranslation("products");
	const [paramName, setParamName] = useState(el.name);
	const [paramValue, setParamValue] = useState(el.value);

	useEffect(() => {
		if (!parameters[activeIndex]?.params) return;
		const indexOfUpdatedParam = parameters[activeIndex].params.indexOf(el);
		const updatedParams = JSON.parse(JSON.stringify(parameters));
		updatedParams[activeIndex].params[indexOfUpdatedParam].name = paramName;

		setParameters(updatedParams);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paramName]);

	useEffect(() => {
		if (!parameters[activeIndex]?.params) return;
		const indexOfUpdatedParam = parameters[activeIndex].params.findIndex(
			(param) => param.id === el.id
		);
		const updatedParams = JSON.parse(JSON.stringify(parameters));
		updatedParams[activeIndex].params[indexOfUpdatedParam].value = paramValue;
		setParameters(updatedParams);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paramValue]);

	function upInOrder() {
		const actualPosition = el.p_order;
		if (actualPosition === 0) {
			return;
		}

		const updatedParams = JSON.parse(JSON.stringify(parameters));
		updatedParams[activeIndex].params.map((item) => {
			if (item.p_order === actualPosition - 1) {
				item.p_order = actualPosition;
			} else if (item.p_order === actualPosition) {
				item.p_order = actualPosition - 1;
			}

			return item;
		});

		updatedParams[activeIndex].params.sort((a, b) => a.p_order - b.p_order);
		setParameters(updatedParams);
	}

	function downInOrder() {
		const actualPosition = el.p_order;
		if (actualPosition === parameters[activeIndex].params.length - 1) {
			return;
		}

		const updatedParams = JSON.parse(JSON.stringify(parameters));
		updatedParams[activeIndex].params.map((item) => {
			if (item.p_order === actualPosition + 1) {
				item.p_order = actualPosition;
			} else if (item.p_order === actualPosition) {
				item.p_order = actualPosition + 1;
			}

			return item;
		});

		updatedParams[activeIndex].params.sort((a, b) => a.p_order - b.p_order);
		setParameters(updatedParams);
	}

	function removeParameter() {
		if (!parameters[activeIndex]?.params) return;
		const indexOfUpdatedParam = parameters[activeIndex].params.indexOf(el);
		const updatedParams = JSON.parse(JSON.stringify(parameters));
		updatedParams[activeIndex].params.splice(indexOfUpdatedParam, 1);

		if (
			indexOfUpdatedParam >= 0 &&
			indexOfUpdatedParam !== updatedParams[activeIndex].params.length - 1
		) {
			updatedParams[activeIndex].params = updatedParams[activeIndex].params.map(
				(item, index) => {
					item.p_order = index;
					return item;
				}
			);
		}
		setParameters(updatedParams);
	}

	return (
		<>
			<input
				defaultValue={paramName}
				placeholder={t("placeholderTitle")}
				required
				onChange={(e) => setParamName(e.target.value)}
			/>
			<input
				defaultValue={paramValue}
				placeholder={t("placeholderParameterValue")}
				required
				onChange={(e) => setParamValue(e.target.value)}
			/>
			<div className={css.btns_cont}>
				<FontAwesomeIcon
					className={css.trash_btn}
					icon={faTrashCan}
					onClick={removeParameter}
				/>
				<DragHandle id={el.id} />
			</div>
		</>
	);
};

export default Parameter;
