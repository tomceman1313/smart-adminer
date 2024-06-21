import {
	faBarsProgress,
	faBuildingUser,
	faCommentDots,
	faReceipt,
	faSquareCheck,
	faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import Select from "../../../components/basic/select/Select";
import InputBox from "../../../components/basic/InputBox";
import DatePicker from "../../../components/basic/DatePicker";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";

export default function OrderFormFields({
	order,
	payment_methods,
	statusCodes,
	shippingTypes,
}) {
	const { t } = useTranslation("orders", "errors", "validationErrors");
	const { setValue } = useFormContext();
	return (
		<>
			<Select
				name="status_code"
				icon={faBarsProgress}
				options={statusCodes.map((status) => {
					return { id: status.id, name: t(status.name) };
				})}
				defaultValue={order.status_code}
				setValue={setValue}
			/>
			<Select
				name="payment_method"
				icon={faBuildingUser}
				options={payment_methods.current}
				defaultValue={order.payment_method}
				setValue={setValue}
			/>
			<Select
				name="shipping_type_id"
				icon={faBuildingUser}
				options={shippingTypes}
				defaultValue={order.shipping_type_id}
				setValue={setValue}
			/>

			<DatePicker
				placeholder={t("placeholderOrderedDate")}
				type="date"
				name="order_date"
				icon={faReceipt}
				additionalClasses="gray half"
			/>

			<DatePicker
				placeholder={t("placeholderShippedDate")}
				type="date"
				name="shipped_date"
				icon={faTruckFast}
				additionalClasses="gray half"
			/>

			<DatePicker
				placeholder={t("placeholderCompletedDate")}
				type="date"
				name="completed_date"
				icon={faSquareCheck}
				additionalClasses="gray half"
			/>

			<InputBox
				placeholder={t("placeholderNotes")}
				type="text"
				name="comments"
				icon={faCommentDots}
			/>
		</>
	);
}
