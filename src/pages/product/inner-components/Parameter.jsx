import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import warningToast from "../../../components/common/warning-toast/WarningToast";
import { useTranslation } from "react-i18next";
import { DragHandle } from "../../../components/common/sortable/DragHandle";
import css from "../styles/Parameters.module.css";

export default function Parameter({
	el,
	parameters,
	setParameters,
	setActiveParams,
	activeIndex,
	isMultiEditActive,
}) {
	const { t } = useTranslation("products", "errors");
	const [paramName, setParamName] = useState(el.name);
	const [paramValue, setParamValue] = useState(el.value);

	function inputOnChange(key, value) {
		if (!parameters[activeIndex]?.params) return;
		const indexOfUpdatedParam = parameters[activeIndex].params.indexOf(el);
		let updatedParams = JSON.parse(JSON.stringify(parameters));

		if (key === "name") {
			//update param of that name for all variants
			if (isMultiEditActive) {
				updatedParams = updatedParams.map((params) => {
					const index = params.params
						.map((param) => param.name)
						.indexOf(el.name);
					if (index >= 0) {
						params.params[index].name = value;
					}
					return params;
				});
			} else {
				updatedParams[activeIndex].params[indexOfUpdatedParam].name = value;
			}
			setParamName(value);
		} else {
			updatedParams[activeIndex].params[indexOfUpdatedParam].value = value;
			setParamValue(value);
		}

		setParameters(updatedParams);
		setActiveParams(updatedParams[activeIndex].params);
	}

	function removeParameter() {
		if (!parameters[activeIndex]?.params) return;
		const updatedParams = JSON.parse(JSON.stringify(parameters));

		if (isMultiEditActive) {
			removeParameterFromAllVariants(updatedParams);
			return;
		}

		const indexOfUpdatedParam = parameters[activeIndex].params.indexOf(el);

		if (indexOfUpdatedParam < 0) {
			warningToast(t("errors:errorDeleteParameter"));
			return;
		}
		updatedParams[activeIndex].params.splice(indexOfUpdatedParam, 1);

		updatedParams[activeIndex].params = updatedParams[activeIndex].params.map(
			(item, index) => {
				item.p_order = index;
				return item;
			}
		);

		setParameters(updatedParams);
		setActiveParams(updatedParams[activeIndex].params);
	}

	function removeParameterFromAllVariants(updatedParams) {
		updatedParams = updatedParams.map((item) => {
			const index = item.params.map((param) => param.name).indexOf(el.name);
			if (index >= 0) {
				item.params.splice(index, 1);

				item.params = item.params.map((param, index) => {
					param.p_order = index;
					return param;
				});
			}

			return item;
		});

		setParameters(updatedParams);
		setActiveParams(updatedParams[activeIndex].params);
	}

	return (
		<>
			<input
				defaultValue={paramName}
				placeholder={t("placeholderTitle")}
				required
				onChange={(e) => inputOnChange("name", e.target.value)}
			/>
			<input
				defaultValue={paramValue}
				placeholder={t("placeholderParameterValue")}
				required
				onChange={(e) => inputOnChange("value", e.target.value)}
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
}
