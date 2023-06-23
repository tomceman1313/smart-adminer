import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import { getAll } from "../../modules/ApiFunctions";
import { isPermitted, makeDateFormat, publicPath } from "../../modules/BasicFunctions";

import css from "./css/Events.module.css";

const Events = () => {
	const auth = useAuth();

	const [events, setEvents] = useState(null);
	const [year, setYear] = useState(new Date().getFullYear());
	const navigate = useNavigate();

	useEffect(() => {
		document.getElementById("banner-title").innerHTML = "Události";
		document.getElementById("banner-desc").innerHTML = "Tvořte a spravujte proběhlé nebo teprv plánované události";

		const loadData = async () => {
			const data = await getAll("events", auth);
			setEvents(data);
		};

		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [year]);

	const openEventDetails = (e) => {
		const id = e.currentTarget.id;
		navigate(`/dashboard/event/${id}`);
	};

	return (
		<div className={css.articles}>
			<section className={css.filter}>
				<h2>Filtrovat:</h2>
				<div>
					<button onClick={() => setYear((prev) => ++prev)}>+</button>
					<label>{year}</label>
					<button onClick={() => setYear((prev) => --prev)}>-</button>
				</div>
				<button className="blue_button">Reset</button>
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
								<label>{makeDateFormat(event.date, "str")}</label>
							</div>

							<div>{isPermitted(event.active)}</div>
						</article>
					))}
			</section>
		</div>
	);
};

export default Events;
