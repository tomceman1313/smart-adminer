import { AnimatePresence } from "framer-motion";
import InfoBox from "./InfoBox";
import css from "./InfoBoxes.module.css";
import { useTranslation } from "react-i18next";

export default function BoxesRow({ stats }) {
	const { t } = useTranslation("dashboard");

	return (
		<section className={`${css.boxes} no-section`}>
			<AnimatePresence>
				<InfoBox
					key={"box-articles"}
					title={t("boxTitleArticles")}
					leftLabel={t("labelTotal")}
					leftCounter={stats?.articles ? stats.articles.total_count : 0}
					rightLabel={t("labelActive")}
					rightCounter={stats?.articles ? stats.articles.active_count : 0}
					linkText={t("linkArticles")}
					linkLocation="/articles"
					delay={0}
				/>
				<InfoBox
					key={"box-employees"}
					title={t("boxTitleEmployees")}
					leftLabel={t("labelTotal")}
					leftCounter={stats?.employees ? stats.employees.total_count : 0}
					rightLabel={t("labelDepartments")}
					rightCounter={
						stats?.employees ? stats?.employees.departments_count : 0
					}
					linkText={t("linkEmployees")}
					linkLocation="/employees"
					delay={0.2}
				/>
				<InfoBox
					key={"box-documents"}
					title={t("boxTitleDocuments")}
					leftLabel={t("labelTotal")}
					leftCounter={stats?.documents ? stats.documents.total_count : 0}
					rightLabel={t("labelTotalCategories")}
					rightCounter={stats?.documents ? stats.documents.categories_count : 0}
					linkText={t("linkDocuments")}
					linkLocation="/documents"
					delay={0.4}
				/>
				<InfoBox
					key={"box-gallery"}
					title={t("boxTitleGallery")}
					leftLabel={t("labelImages")}
					leftCounter={stats?.gallery ? stats.gallery.total_count : 0}
					rightLabel={t("labelTotalCategories")}
					rightCounter={stats?.gallery ? stats.gallery.categories_count : 0}
					linkText={t("linkGallery")}
					linkLocation="/gallery"
					delay={0.6}
				/>
				<InfoBox
					key={"box-orders"}
					title={t("boxTitleOrders")}
					leftLabel={t("labelTotal")}
					leftCounter={stats?.orders ? stats.orders.total_count : 0}
					rightLabel={t("labelPending")}
					rightCounter={stats?.orders ? stats.orders.pending_count : 0}
					linkText={t("linkOrders")}
					linkLocation="/orders"
					delay={0.8}
				/>
			</AnimatePresence>
		</section>
	);
}
