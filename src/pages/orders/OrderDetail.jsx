import { faBarsProgress, faBuildingUser, faCommentDots, faReceipt, faSquareCheck, faTruckFast, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import InputBox from "../../components/basic/InputBox";
import useInteraction from "../../hooks/useInteraction";
import { edit, get, remove } from "../../modules/ApiFunctions";
import css from "./css/OrderDetail.module.css";

import { useForm } from "react-hook-form";
import DatePicker from "../../components/basic/DatePicker";
import Select from "../../components/basic/select/Select";
import useAuth from "../../hooks/useAuth";
import { makeDateFormat } from "../../modules/BasicFunctions";
import CompanyCredentialsForm from "./detail/CompanyCredentialsForm";
import DeliveryCredentialsForm from "./detail/DeliveryCredentialsForm";
import InvoiceCredentialsForm from "./detail/InvoiceCredentialsForm";
import OrderedProducts from "./detail/OrderedProducts";
import { useTranslation } from "react-i18next";

export default function OrderDetail({ id, setVisible, shippingTypes, statusCodes, reloadData }) {
	const { t } = useTranslation("orders");
	const { setMessage, setAlert } = useInteraction();
	const auth = useAuth();

	const PAYMENT_METHODS = useRef([
		{ value: "cash", name: t("cash") },
		{ value: "card", name: t("card") },
		{ value: "bank_account", name: t("bank_account") },
	]);

	const { register, handleSubmit, setValue } = useForm();
	const [order, setOrder] = useState(null);
	const [products, setProducts] = useState(null);

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	async function loadData() {
		const _order = await get("orders", id);
		_order.deleted_products = [];
		setOrder(_order);
		setProducts(_order.ordered_products);

		setValue("order_date", makeDateFormat(_order.order_date, "str"));
		setValue("shipped_date", makeDateFormat(_order.shipped_date, "str"));
		setValue("completed_date", makeDateFormat(_order.completed_date, "str"));
		setValue("comments", _order.comments);

		setValue("company_name", _order.customer.company_name);
		setValue("ic", _order.customer.ic ? _order.customer.ic : "");
		setValue("dic", _order.customer.dic ? _order.customer.dic : "");

		setValue("status_code", _order.status_code);
		setValue("payment_method", _order.payment_method);
		setValue("shipping_type_id", _order.shipping_type_id);
	}

	async function onSubmit(data) {
		data.id = order.id;
		data.ordered_products = order.ordered_products;
		data.deleted_products = order.deleted_products;

		data.order_date = makeDateFormat(data.order_date);

		if (data.shipped_date) {
			data.shipped_date = makeDateFormat(data.shipped_date);
		}

		if (data.completed_date) {
			data.completed_date = makeDateFormat(data.completed_date);
		}

		data.customer_id = order.customer.id;
		await edit("orders", data, setMessage, t("positiveTextOrderUpdated"), auth);
		reloadData();
		setVisible(false);
	}

	function deleteOrder() {
		setAlert({ id: order.id, question: t("alertDeleteOrder"), positiveHandler: deleteOrderHandler });
	}

	async function deleteOrderHandler(id) {
		await remove("orders", id, setMessage, t("positiveTextOrderDeleted"), auth);
		await reloadData();
		setVisible(false);
	}

	return (
		<motion.section className={css.edit} initial={{ x: -600 }} animate={{ x: 0 }} exit={{ x: -600 }} transition={{ type: "spring", duration: 1.5 }}>
			<h2>{t("headerOrderNumber", { id: order?.id })}</h2>
			<FontAwesomeIcon
				id={css.close}
				icon={faXmark}
				onClick={() => {
					setVisible((prev) => !prev);
				}}
			/>
			<form onSubmit={handleSubmit(onSubmit)}>
				<OrderedProducts order={order} products={products} setOrder={setOrder} setProducts={setProducts} />

				<h3>{t("headerOrderInfo")}</h3>

				<Select
					name="status_code"
					register={register}
					icon={faBarsProgress}
					options={statusCodes.map((status) => {
						return { id: status.id, name: t(status.name) };
					})}
				/>
				<Select name="payment_method" register={register} icon={faBuildingUser} options={PAYMENT_METHODS.current} />
				<Select name="shipping_type_id" register={register} icon={faBuildingUser} options={shippingTypes} />

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

				<InputBox placeholder={t("placeholderNotes")} register={register} type="text" name="comments" icon={faCommentDots} />

				<InvoiceCredentialsForm register={register} customer={order?.customer} />

				{order && (
					<>
						<DeliveryCredentialsForm register={register} customer={order?.customer} />
						<CompanyCredentialsForm register={register} customer={order?.customer} />
					</>
				)}

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
