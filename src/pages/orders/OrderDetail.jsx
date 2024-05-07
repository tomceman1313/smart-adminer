import {
	faBarsProgress,
	faBuildingUser,
	faCommentDots,
	faReceipt,
	faSquareCheck,
	faTruckFast,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DatePicker from "../../components/basic/DatePicker";
import InputBox from "../../components/basic/InputBox";
import Select from "../../components/basic/select/Select";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import useInteraction from "../../hooks/useInteraction";
import { makeDateFormat } from "../../modules/BasicFunctions";
import css from "./css/OrderDetail.module.css";
import CompanyCredentialsForm from "./detail/CompanyCredentialsForm";
import DeliveryCredentialsForm from "./detail/DeliveryCredentialsForm";
import InvoiceCredentialsForm from "./detail/InvoiceCredentialsForm";
import OrderedProducts from "./detail/OrderedProducts";

export default function OrderDetail({
	id,
	setVisible,
	shippingTypes,
	statusCodes,
	reloadData,
}) {
	const { t } = useTranslation("orders", "errors");
	const { get, edit, remove } = useBasicApiFunctions();
	const { setAlert } = useInteraction();

	const PAYMENT_METHODS = useRef([
		{ value: "cash", name: t("cash") },
		{ value: "card", name: t("card") },
		{ value: "bank_account", name: t("bank_account") },
	]);

	const { register, handleSubmit, setValue, reset } = useForm();
	const [products, setProducts] = useState(null);

	const { data: order } = useQuery({
		queryKey: ["order", id],
		queryFn: async () => {
			reset();
			const _order = await get("orders", id);
			_order.deleted_products = [];
			setProducts({
				orderedProducts: _order.ordered_products,
				deletedProducts: [],
			});

			setValue("order_date", makeDateFormat(_order.order_date, "str"));
			setValue("shipped_date", makeDateFormat(_order.shipped_date, "str"));
			setValue("completed_date", makeDateFormat(_order.completed_date, "str"));
			setValue("comments", _order.comments);

			setValue("status_code", _order.status_code);
			setValue("payment_method", _order.payment_method);
			setValue("shipping_type_id", _order.shipping_type_id);
			return _order;
		},
		meta: {
			errorMessage: t("errors:errorFetchOrder"),
		},
	});

	async function onSubmit(data) {
		data.id = order.id;
		data.ordered_products = products.orderedProducts;
		data.deleted_products = products.deletedProducts;

		data.order_date = makeDateFormat(data.order_date);

		if (data.shipped_date) {
			data.shipped_date = makeDateFormat(data.shipped_date);
		}

		if (data.completed_date) {
			data.completed_date = makeDateFormat(data.completed_date);
		}
		data.customer_id = order.customer.id;
		await edit("orders", data, t("positiveTextOrderUpdated"));
		reloadData();
		reset();
		setVisible(false);
	}

	function deleteOrder() {
		setAlert({
			id: order.id,
			question: t("alertDeleteOrder"),
			positiveHandler: deleteOrderHandler,
		});
	}

	async function deleteOrderHandler(id) {
		await remove("orders", id, t("positiveTextOrderDeleted"));
		await reloadData();
		setVisible(false);
	}

	return (
		<motion.section
			className={css.edit}
			initial={{ x: -600 }}
			animate={{ x: 0 }}
			exit={{ x: -600 }}
			transition={{ type: "spring", duration: 1.5 }}
		>
			<h2>{t("headerOrderNumber", { id: order?.id })}</h2>
			<FontAwesomeIcon
				id={css.close}
				icon={faXmark}
				onClick={() => {
					reset();
					setVisible(false);
				}}
			/>
			<form onSubmit={handleSubmit(onSubmit)}>
				<OrderedProducts
					order={order}
					products={products}
					setProducts={setProducts}
				/>

				<h3>{t("headerOrderInfo")}</h3>

				<Select
					name="status_code"
					register={register}
					icon={faBarsProgress}
					options={statusCodes.map((status) => {
						return { id: status.id, name: t(status.name) };
					})}
				/>
				<Select
					name="payment_method"
					register={register}
					icon={faBuildingUser}
					options={PAYMENT_METHODS.current}
				/>
				<Select
					name="shipping_type_id"
					register={register}
					icon={faBuildingUser}
					options={shippingTypes}
				/>

				<DatePicker
					placeholder={t("placeholderOrderedDate")}
					register={register}
					type="date"
					name="order_date"
					icon={faReceipt}
					isRequired={true}
					additionalClasses="gray half"
				/>

				<DatePicker
					placeholder={t("placeholderShippedDate")}
					register={register}
					type="date"
					name="shipped_date"
					icon={faTruckFast}
					additionalClasses="gray half"
				/>

				<DatePicker
					placeholder={t("placeholderCompletedDate")}
					register={register}
					type="date"
					name="completed_date"
					icon={faSquareCheck}
					additionalClasses="gray half"
				/>

				<InputBox
					placeholder={t("placeholderNotes")}
					register={register}
					type="text"
					name="comments"
					icon={faCommentDots}
				/>

				<InvoiceCredentialsForm
					register={register}
					customer={order?.customer}
				/>

				<DeliveryCredentialsForm
					key={`delivery-${order?.customer.delivery_address}`}
					register={register}
					customer={order?.customer}
				/>
				<CompanyCredentialsForm
					key={`company-${order?.customer.company_name}`}
					register={register}
					customer={order?.customer}
				/>

				<div className={css.buttons_box}>
					<button>{t("buttonSave")}</button>
					<button type="button" className="red_button" onClick={deleteOrder}>
						{t("buttonDelete")}
					</button>
				</div>
			</form>
		</motion.section>
	);
}
