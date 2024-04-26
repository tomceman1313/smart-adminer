import { AnimatePresence } from "framer-motion";
import InfoBox from "./InfoBox";
import css from "./InfoBoxes.module.css";

export default function BoxesRow({ stats }) {
	return (
		<section className={`${css.boxes} no-section`}>
			<AnimatePresence>
				<InfoBox
					title="Články"
					leftLabel="Celkem:"
					leftCounter={stats?.articles ? stats.articles.total_count : 0}
					rightLabel="Aktivní:"
					rightCounter={stats?.articles ? stats.articles.active_count : 0}
					linkText="Přejít na články"
					linkLocation="/articles"
					delay={0}
				/>
				<InfoBox
					title="Zaměstnanci"
					leftLabel="Celkem:"
					leftCounter={stats?.employees ? stats.employees.total_count : 0}
					rightLabel="Oddělení:"
					rightCounter={
						stats?.employees ? stats?.employees.departments_count : 0
					}
					linkText="Přejít na zaměstnance"
					linkLocation="/employees"
					delay={0.2}
				/>
				<InfoBox
					title="Dokumenty"
					leftLabel="Celkem:"
					leftCounter={stats?.documents ? stats.documents.total_count : 0}
					rightLabel="Celkem kategorií:"
					rightCounter={stats?.documents ? stats.documents.categories_count : 0}
					linkText="Přejít na dokumenty"
					linkLocation="/documents"
					delay={0.4}
				/>
				<InfoBox
					title="Galerie"
					leftLabel="Obrázků:"
					leftCounter={stats?.gallery ? stats.gallery.total_count : 0}
					rightLabel="Celkem kategorií:"
					rightCounter={stats?.gallery ? stats.gallery.categories_count : 0}
					linkText="Přejít do galerie"
					linkLocation="/gallery"
					delay={0.6}
				/>
				<InfoBox
					title="Objednávky"
					leftLabel="Počet:"
					leftCounter={stats?.orders ? stats.orders.total_count : 0}
					rightLabel="Nevyřízené:"
					rightCounter={stats?.orders ? stats.orders.pending_count : 0}
					linkText="Přejít na objednávky"
					linkLocation="/orders"
					delay={0.8}
				/>
			</AnimatePresence>
		</section>
	);
}
