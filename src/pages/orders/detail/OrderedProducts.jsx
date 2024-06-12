import { useTranslation } from "react-i18next";
import useInteraction from "../../../hooks/useInteraction";
import { publicPath } from "../../../modules/BasicFunctions";

import css from "../css/OrderDetail.module.css";

export default function OrderedProducts({ products, setProducts }) {
	const { t } = useTranslation("orders");
	const { setAlert } = useInteraction();

	function productQuantityChanged(e, index) {
		const newQuantity = Number(e.target.value);
		if (newQuantity === 0) {
			e.target.value = 1;
			setAlert({
				id: index,
				question: t("alertDeleteProduct"),
				positiveHandler: deleteProductFromOrdered,
			});
		} else {
			setProducts((prev) => {
				const orderedProducts = prev.orderedProducts.map((product, i) => {
					if (i === index) {
						return { ...product, quantity: newQuantity };
					}
					return product;
				});

				return { ...prev, orderedProducts: orderedProducts };
			});
		}
	}

	function deleteProductFromOrdered(index) {
		const orderedProducts = JSON.parse(
			JSON.stringify(products.orderedProducts)
		);
		const deletedProducts = JSON.parse(
			JSON.stringify(products.deletedProducts)
		);

		const deletedProduct = orderedProducts.splice(index, 1);
		orderedProducts.splice(index, 1);

		setProducts({
			orderedProducts: orderedProducts,
			deletedProducts: deletedProducts.push(deletedProduct),
		});
	}

	return (
		<ul className={css.products_list}>
			{products &&
				products?.orderedProducts.map((product, index) => (
					<li key={`ordered-product-${product.variant_id}`}>
						<img
							src={`${publicPath}/images/products/${product.image}`}
							alt={product.name}
						/>
						<b>{`${product.product_name} - ${product.variant_name}`}</b>
						<span>
							<input
								defaultValue={product.quantity}
								type="number"
								onChange={(e) => productQuantityChanged(e, index)}
							/>
							<label> ks</label>
						</span>
						<label>{`${product.price_piece * product.quantity} Kč`}</label>
					</li>
				))}
		</ul>
	);
}
