import {
	faBarsProgress,
	faBuilding,
	faBuildingUser,
	faCommentDots,
	faCopyright,
	faHandHoldingDollar,
	faReceipt,
	faSquareCheck,
	faTruckFast,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import InputBox from "../../Components/basic/InputBox";
import useInteraction from "../../Hooks/useInteraction";
import { edit, get, remove } from "../../modules/ApiFunctions";
import css from "./css/OrderDetail.module.css";

import { useForm } from "react-hook-form";
import DatePicker from "../../Components/basic/DatePicker";
import Select from "../../Components/basic/select/Select";
import useAuth from "../../Hooks/useAuth";
import { makeDateFormat } from "../../modules/BasicFunctions";
import DeliveryCredentialsForm from "./detail/DeliveryCredentialsForm";
import InvoiceCredentialsForm from "./detail/InvoiceCredentialsForm";
import OrderedProducts from "./detail/OrderedProducts";

const PAYMENT_METHODS = [
	{ value: "cash", name: "Hotově" },
	{ value: "card", name: "Online kartou" },
	{ value: "bank_account", name: "Převodem na účet" },
];

const ORDER_STATUSES = [
	{ id: 1, name: "Přijata" },
	{ id: 2, name: "Odeslána" },
	{ id: 3, name: "Dokončena" },
	{ id: 4, name: "Zrušena" },
];

export default function OrderDetail({ id, setVisible, shippingTypes, reloadData }) {
	const { setMessage, setAlert } = useInteraction();
	const auth = useAuth();

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
		console.log("order", _order);
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
		data.order_id = order.id;
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
		console.log(data);
		edit("orders", data, setMessage, "Objednávka byla upravena", auth);
		setVisible(false);
	}

	function deleteOrder() {
		setAlert({ id: order.id, question: "Opravdu si přejete smazat objednávku?", positiveHandler: deleteOrderHandler });
	}

	async function deleteOrderHandler(id) {
		await remove("orders", id, setMessage, "Objednávka byla smazána", auth);
		await reloadData();
		setVisible(false);
	}

	return (
		<motion.section className={css.edit} initial={{ x: -600 }} animate={{ x: 0 }} exit={{ x: -600 }} transition={{ type: "spring", duration: 1.5 }}>
			<h2>Objednávka č.: {order?.id}</h2>
			<FontAwesomeIcon
				id={css.close}
				icon={faXmark}
				onClick={() => {
					setVisible((prev) => !prev);
				}}
			/>
			<form onSubmit={handleSubmit(onSubmit)}>
				<OrderedProducts order={order} products={products} setOrder={setOrder} setProducts={setProducts} />

				<h3>Informace o objednávce:</h3>

				<Select name="status_code" register={register} icon={faBarsProgress} options={ORDER_STATUSES} />
				<Select name="payment_method" register={register} icon={faBuildingUser} options={PAYMENT_METHODS} />
				<Select name="shipping_type_id" register={register} icon={faBuildingUser} options={shippingTypes} />

				<DatePicker
					placeholder="Datum objednání"
					register={register}
					type="date"
					name="order_date"
					icon={faReceipt}
					isRequired={true}
					additionalClasses="gray half"
				/>

				<DatePicker
					placeholder="Datum odeslání"
					register={register}
					type="date"
					name="shipped_date"
					icon={faTruckFast}
					additionalClasses="gray half"
				/>

				<DatePicker
					placeholder="Datum dokončení"
					register={register}
					type="date"
					name="completed_date"
					icon={faSquareCheck}
					additionalClasses="gray half"
				/>

				<InputBox placeholder="Poznámky" register={register} type="text" name="comments" icon={faCommentDots} />

				<InvoiceCredentialsForm register={register} customer={order?.customer} />

				<DeliveryCredentialsForm register={register} customer={order?.customer} />

				<h3>Nákup na firmu:</h3>
				<InputBox placeholder="Název firmy" register={register} name="company_name" icon={faCopyright} />
				<InputBox placeholder="IČ" register={register} name="ic" icon={faBuilding} />
				<InputBox placeholder="DIČ" register={register} name="dic" icon={faHandHoldingDollar} />

				<button>Uložit</button>
				<button type="button" className="red_button" onClick={deleteOrder}>
					Smazat
				</button>
			</form>
		</motion.section>
	);
}
