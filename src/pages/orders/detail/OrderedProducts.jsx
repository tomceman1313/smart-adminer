import { useTranslation } from "react-i18next";
import useInteraction from "../../../hooks/useInteraction";
import { publicPath } from "../../../modules/BasicFunctions";

export default function OrderedProducts({
	products,
	order,
	setOrder,
	setProducts,
}) {
	const { t } = useTranslation("orders");
	const { setAlert } = useInteraction();

	function productQuantityChanged(e, index) {
		const newQuantity = Number(e.target.value);
		const updatedOrder = JSON.parse(JSON.stringify(order));
		if (newQuantity === 0) {
			e.target.value = 1;
			setAlert({
				id: index,
				question: t("alertDeleteProduct"),
				positiveHandler: deleteProductFromOrdered,
			});
		} else {
			updatedOrder.ordered_products[index].quantity = newQuantity;
		}
		//FIXME:opravit ze state na query
	}

	function deleteProductFromOrdered(index) {
		const updatedOrder = JSON.parse(JSON.stringify(order));
		const updatedProducts = JSON.parse(JSON.stringify(products));

		const deletedProduct = updatedOrder.ordered_products.splice(index, 1);
		updatedProducts.splice(index, 1);

		updatedOrder.deleted_products.push(deletedProduct);
		setProducts(updatedProducts);
	}

	return (
		<ul>
			{products &&
				products.map((el, index) => (
					<li key={`ordered-product-${el.variant_id}`}>
						<img
							src={`${publicPath}/images/products/${el.image}`}
							alt={el.name}
						/>
						<b>{`${el.product_name} - ${el.variant_name}`}</b>
						<span>
							<input
								defaultValue={order.ordered_products[index]?.quantity}
								type="number"
								onChange={(e) => productQuantityChanged(e, index)}
							/>
							<label> ks</label>
						</span>
						<label>{`${
							order.ordered_products[index]?.price_piece *
							order.ordered_products[index]?.quantity
						} Kč`}</label>
					</li>
				))}
		</ul>
	);
}
