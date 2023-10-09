import useInteraction from "../../../Hooks/useInteraction";
import { publicPath } from "../../../modules/BasicFunctions";

export default function OrderedProducts({ products, order, setOrder, setProducts }) {
	const { setAlert } = useInteraction();

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

	return (
		<ul>
			{products &&
				products.map((el, index) => (
					<li key={`ordered-product-${el.variant_id}`}>
						<img src={`${publicPath}/images/products/${el.image}`} alt={el.name} />
						<b>{`${el.product_name} - ${el.variant_name}`}</b>
						<span>
							<input defaultValue={order.ordered_products[index]?.quantity} type="number" onChange={(e) => productQuantityChanged(e, index)} />
							<label> ks</label>
						</span>
						<label>{`${order.ordered_products[index]?.price_piece * order.ordered_products[index]?.quantity} Kč`}</label>
					</li>
				))}
		</ul>
	);
}
