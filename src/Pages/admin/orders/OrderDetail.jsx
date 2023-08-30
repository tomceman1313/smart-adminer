import {
	faAt,
	faBarsProgress,
	faBuilding,
	faBuildingUser,
	faBullseye,
	faCommentDots,
	faCopyright,
	faHandHoldingDollar,
	faIdBadge,
	faImagePortrait,
	faLocationDot,
	faLocationPin,
	faPhone,
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
import cssBasic from "../styles/Basic.module.css";
import css from "./css/OrderDetail.module.css";

import { useForm } from "react-hook-form";
import DatePicker from "../../Components/basic/DatePicker";
import { makeDateFormat } from "../../modules/BasicFunctions";
import useAuth from "../../Hooks/useAuth";
import { getProductByIds } from "../../modules/ApiProducts";
import { publicPath } from "../../modules/BasicFunctions";

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
		console.log(_order);

		const _products = await getProductByIds(_order.ordered_products);
		console.log(_products);
		setProducts(_products);

		setValue("order_date", makeDateFormat(_order.order_date, "str"));
		setValue("shipped_date", makeDateFormat(_order.shipped_date, "str"));
		setValue("completed_date", makeDateFormat(_order.completed_date, "str"));
		setValue("comments", _order.comments);

		setValue("fname", _order.customer.fname);
		setValue("lname", _order.customer.lname);
		setValue("phone", _order.customer.phone);
		setValue("email", _order.customer.email);
		setValue("address", _order.customer.address);
		setValue("city", _order.customer.city);
		setValue("postal_code", _order.customer.postal_code);

		setValue("delivery_fname", _order.customer.delivery_fname);
		setValue("delivery_lname", _order.customer.delivery_lname);
		setValue("delivery_address", _order.customer.delivery_address);
		setValue("delivery_city", _order.customer.delivery_city);
		setValue("delivery_postal_code", _order.customer.delivery_postal_code ? _order.customer.delivery_postal_code : "");

		setValue("company_name", _order.customer.company_name);
		setValue("ic", _order.customer.ic ? _order.customer.ic : "");
		setValue("dic", _order.customer.dic ? _order.customer.dic : "");

		setValue("status_code", _order.status_code);
		setValue("payment_type", _order.payment_type);
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

	function productQuantityChanged(e, index) {
		const newQuantity = Number(e.target.value);
		const updatedOrder = JSON.parse(JSON.stringify(order));
		if (newQuantity === 0) {
			e.target.value = 1;
			setAlert({ id: index, question: "Opravdu si přejete smazat produkt z objednávky?", positiveHandler: deleteProductFromOrdered });
		} else {
			updatedOrder.ordered_products[index].quantity = newQuantity;
		}
		setOrder(updatedOrder);
	}

	function deleteProductFromOrdered(index) {
		const updatedOrder = JSON.parse(JSON.stringify(order));
		const updatedProducts = JSON.parse(JSON.stringify(products));

		const deletedProduct = updatedOrder.ordered_products.splice(index, 1);
		updatedProducts.splice(index, 1);

		updatedOrder.deleted_products.push(deletedProduct);
		setProducts(updatedProducts);
		setOrder(updatedOrder);
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
				<ul>
					{products &&
						products.map((el, index) => (
							<li key={`ordered-product-${el.id}`}>
								<img src={`${publicPath}/images/products/${el.image}`} alt={el.name} />
								<b>{el.name}</b>
								<span>
									<input defaultValue={order.ordered_products[index]?.quantity} type="number" onChange={(e) => productQuantityChanged(e, index)} />
									<label> ks</label>
								</span>
								<label>{`${order.ordered_products[index]?.price_piece * order.ordered_products[index]?.quantity} Kč`}</label>
							</li>
						))}
				</ul>

				<h3>Informace o objednávce:</h3>

				<div className={cssBasic.input_box}>
					<select {...register("status_code")} required>
						<option value="1">Přijata</option>
						<option value="2">Odeslána</option>
						<option value="3">Dokončena</option>
						<option value="4">Zrušena</option>
					</select>
					<FontAwesomeIcon className={cssBasic.icon} icon={faBarsProgress} />
				</div>

				<div className={cssBasic.input_box}>
					<select {...register("payment_type")} required>
						<option value="cash">Hotově</option>
						<option value="card">Online kartou</option>
						<option value="bank_account">Převodem na účet</option>
					</select>
					<FontAwesomeIcon className={cssBasic.icon} icon={faBuildingUser} />
				</div>

				{shippingTypes && (
					<div className={cssBasic.input_box}>
						<select {...register("shipping_type_id")} required>
							{shippingTypes.map((el) => (
								<option key={`shipping-type-${el.id}`} value={el.id}>
									{el.name}
								</option>
							))}
						</select>
						<FontAwesomeIcon className={cssBasic.icon} icon={faBuildingUser} />
					</div>
				)}

				<DatePicker
					placeholder="Datum objednání"
					register={register}
					type="date"
					name="order_date"
					icon={faReceipt}
					isRequired={true}
					additionalClasses="gray"
				/>

				<DatePicker placeholder="Datum odeslání" register={register} type="date" name="shipped_date" icon={faTruckFast} additionalClasses="gray" />

				<DatePicker
					placeholder="Datum dokončení"
					register={register}
					type="date"
					name="completed_date"
					icon={faSquareCheck}
					additionalClasses="gray"
				/>

				<InputBox placeholder="Poznámky" register={register} type="text" name="comments" icon={faCommentDots} />

				<h3>Fakturační údaje:</h3>
				<InputBox placeholder="Křestní jméno" register={register} name="fname" icon={faImagePortrait} isRequired={true} />
				<InputBox placeholder="Příjmení" register={register} name="lname" icon={faIdBadge} isRequired={true} />
				<InputBox placeholder="Telefon" register={register} type="tel" name="phone" icon={faPhone} isRequired={true} />
				<InputBox placeholder="Email" register={register} type="email" name="email" icon={faAt} isRequired={true} />
				<InputBox placeholder="Adresa (ulice, č.p.)" register={register} name="address" icon={faLocationDot} isRequired={true} />
				<InputBox placeholder="Město" register={register} name="city" icon={faLocationPin} isRequired={true} />
				<InputBox placeholder="PSČ" register={register} name="postal_code" icon={faBullseye} isRequired={true} />

				<h3>Doručovací údaje:</h3>
				<InputBox placeholder="Křestní jméno" register={register} name="delivery_fname" icon={faImagePortrait} />
				<InputBox placeholder="Příjmení" register={register} name="delivery_lname" icon={faIdBadge} />
				<InputBox placeholder="Adresa (ulice, č.p.)" register={register} name="delivery_address" icon={faLocationDot} />
				<InputBox placeholder="Město" register={register} name="delivery_city" icon={faLocationPin} />
				<InputBox placeholder="PSČ" register={register} name="delivery_postal_code" icon={faBullseye} />

				<h3>Nákup na firmu:</h3>
				<InputBox placeholder="Název firmy" register={register} name="company_name" icon={faCopyright} />
				<InputBox placeholder="IČ" register={register} name="ic" icon={faBuilding} />
				<InputBox placeholder="DIČ" register={register} name="dic" icon={faHandHoldingDollar} />

				<button>Uložit</button>
				<button type="button" onClick={deleteOrder}>
					Smazat
				</button>
			</form>
		</motion.section>
	);
}
