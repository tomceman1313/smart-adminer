import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Form from "../../components/basic/form/Form";
import { useDelete, useGet, useUpdate } from "../../hooks/api/useCRUD";
import useInteraction from "../../hooks/useInteraction";
import { makeDateFormat } from "../../modules/BasicFunctions";
import { orderSchema } from "../../schemas/zodSchemas";
import css from "./css/OrderDetail.module.css";
import CompanyCredentialsForm from "./detail/CompanyCredentialsForm";
import DeliveryCredentialsForm from "./detail/DeliveryCredentialsForm";
import InvoiceCredentialsForm from "./detail/InvoiceCredentialsForm";
import OrderFormFields from "./detail/OrderFormFields";
import OrderedProducts from "./detail/OrderedProducts";

export default function OrderDetail({
	id,
	setVisible,
	shippingTypes,
	statusCodes,
	reloadData,
}) {
	const { t } = useTranslation("orders", "errors", "validationErrors");
	const { setAlert } = useInteraction();
	const formMethods = useForm({ resolver: zodResolver(orderSchema(t)) });

	const PAYMENT_METHODS = useRef([
		{ value: "cash", name: t("cash") },
		{ value: "card", name: t("card") },
		{ value: "bank_account", name: t("bank_account") },
	]);

	const [products, setProducts] = useState(null);

	const { data: order } = useGet(
		"orders",
		id,
		["order", id],
		t("errors:errorFetchOrder")
	);

	const { mutateAsync: edit } = useUpdate(
		"orders",
		t("positiveTextOrderUpdated"),
		null,
		["orders"]
	);

	const { mutateAsync: remove } = useDelete(
		"orders",
		t("positiveTextOrderDeleted"),
		null,
		["orders"]
	);

	useEffect(() => {
		formMethods.reset();
		if (order) {
			order.deleted_products = [];
			setProducts({
				orderedProducts: order.ordered_products,
				deletedProducts: [],
			});
			formMethods.setValue(
				"order_date",
				makeDateFormat(order.order_date, "str")
			);
			formMethods.setValue(
				"shipped_date",
				makeDateFormat(order.shipped_date, "str")
			);
			formMethods.setValue(
				"completed_date",
				makeDateFormat(order.completed_date, "str")
			);
			formMethods.setValue("comments", order.comments);
		}
	}, [order, formMethods]);

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
		await edit(data);
		reloadData();
		formMethods.reset();
		setVisible(false);
	}

	async function deleteOrderHandler(id) {
		await remove(id);
		await reloadData();
		setVisible(false);
	}

	return (
		<>
			{order && (
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
							formMethods.reset();
							setVisible(false);
						}}
					/>
					<Form onSubmit={onSubmit} formContext={formMethods}>
						<OrderedProducts
							order={order}
							products={products}
							setProducts={setProducts}
						/>

						<h3>{t("headerOrderInfo")}</h3>

						<OrderFormFields
							order={order}
							payment_methods={PAYMENT_METHODS}
							shippingTypes={shippingTypes}
							statusCodes={statusCodes}
						/>

						<InvoiceCredentialsForm customer={order?.customer} />

						<DeliveryCredentialsForm
							key={`delivery-${order?.customer.delivery_address}`}
							customer={order?.customer}
						/>
						<CompanyCredentialsForm
							key={`company-${order?.customer.company_name}`}
							customer={order?.customer}
						/>

						<div className={css.buttons_box}>
							<button>{t("buttonSave")}</button>
							<button
								type="button"
								className="red_button"
								onClick={() =>
									setAlert({
										id: order.id,
										question: t("alertDeleteOrder"),
										positiveHandler: deleteOrderHandler,
									})
								}
							>
								{t("buttonDelete")}
							</button>
						</div>
					</Form>
				</motion.section>
			)}
		</>
	);
}
