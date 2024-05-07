import css from "./styles/Product.module.css";
import { isPermitted } from "../../modules/BasicFunctions";
import { publicPath } from "../../modules/BasicFunctions";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function Product({ product, deleteProduct }) {
	const { t } = useTranslation("products");
	return (
		<motion.div
			key={product.id}
			className={css.product_card}
			initial={{ scale: 0.8 }}
			animate={{ scale: 1 }}
		>
			<img src={`${publicPath}/images/products/${product.image}`} alt="" />
			{isPermitted(product.active)}
			<div>
				<p>{product.name}</p>
				<Link className="button" to={`/product/${product.id}`}>
					{t("buttonDetail")}
				</Link>
				<button
					className="red_button"
					onClick={() => deleteProduct(product.id, product.name)}
				>
					{t("buttonDelete")}
				</button>
			</div>
		</motion.div>
	);
}
