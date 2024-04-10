import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PlusButton from "../../components/basic/PlusButton";
import Category from "../../components/common/categories-component/Category";
import FilterNotifier from "../../components/common/filter-notifier/FilterNotifier";
import { getAll, getByCategory } from "../../modules/ApiFunctions";
import { isPermitted, makeDateFormat, publicPath } from "../../modules/BasicFunctions";
import { Helmet } from "react-helmet-async";
import css from "./css/Events.module.css";
import { useTranslation } from "react-i18next";

const Events = () => {
	const { t } = useTranslation("events");
	const navigate = useNavigate();

	const allEvents = useRef([]);
	const [events, setEvents] = useState(null);
	const [year, setYear] = useState(new Date().getFullYear());
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const filteredByYear = allEvents.current.filter((el) => year === getEventYear(el.date));
		setEvents(filteredByYear);
	}, [year]);

	async function loadData() {
		setSelectedCategory(null);
		const data = await getAll("events");
		allEvents.current = data;
		filterByDate();
	}

	function filterByDate() {
		const filteredByYear = allEvents.current.filter((el) => year === getEventYear(el.date));
		setEvents(filteredByYear);
	}

	function getEventYear(date) {
		let slicedYear = date.toString();
		slicedYear = slicedYear.slice(0, 4);
		return Number(slicedYear);
	}

	const openEventDetails = (e) => {
		const id = e.currentTarget.id;
		navigate(`/event/${id}`);
	};

	async function filterByCategory(id) {
		const data = await getByCategory("events", id);
		allEvents.current = data;
		const category = categories.find((el) => el.id === id);
		setSelectedCategory(category.name);
		filterByDate();
	}

	return (
		<div className={css.articles}>
			<Helmet>
				<title>{t("htmlTitleEvents")}</title>
			</Helmet>
			<Category
				categories={categories}
				setCategories={setCategories}
				apiClass="events"
				filterByCategory={filterByCategory}
				reloadData={loadData}
				fullSize
			/>
			<FilterNotifier selectedCategory={selectedCategory} resetHandler={loadData} />
			<section className={css.filter}>
				<h2>{t("headerFilter")}</h2>
				<div>
					<button onClick={() => setYear((prev) => ++prev)}>+</button>
					<label>{year}</label>
					<button onClick={() => setYear((prev) => --prev)}>-</button>
				</div>
				<button className="green_button" onClick={() => setYear(new Date().getFullYear())}>
					{t("buttonReset")}
				</button>
			</section>

			<section className={`${css.events_list} no-section`}>
				{events &&
					events.map((event) => (
						<article key={event.id} id={event.id} onClick={openEventDetails}>
							<img src={`${publicPath}/images/events/${event.image}`} alt="" />
							<div>
								<h3>{event.title}</h3>
								<p>{event.description}</p>
							</div>

							<div>
								<label>{makeDateFormat(event.date, "text")}</label>
							</div>

							<div>{isPermitted(event.active)}</div>
						</article>
					))}
			</section>
			<PlusButton onClick={() => navigate(`/new-event/`)} />
		</div>
	);
};

export default Events;
