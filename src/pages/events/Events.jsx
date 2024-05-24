import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PlusButton from "../../components/basic/PlusButton";
import CategoriesController from "../../components/common/categories-controller/CategoriesController";
import ItemsController from "../../components/common/items-controller/ItemsController";
import {
	isPermitted,
	makeDateFormat,
	publicPath,
} from "../../modules/BasicFunctions";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import useItemsControllerApiFunctions from "../../hooks/api/useItemsControllerApiFunctions";
import { useQuery } from "@tanstack/react-query";
import ArticleCardLoader from "../../components/loaders/ArticleCardLoader";

import css from "./css/Events.module.css";
import NoDataFound from "../../components/loaders/NoDataFound/NoDataFound";

const Events = () => {
	const { t } = useTranslation("events", "errors");
	const navigate = useNavigate();
	const { getAll, getByCategory } = useBasicApiFunctions();
	const { searchByName } = useItemsControllerApiFunctions();

	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [searchedName, setSearchedName] = useState("");

	const {
		data: events,
		refetch: refetchEvents,
		isLoading,
	} = useQuery({
		queryKey: ["events", selectedCategory, searchedName],
		queryFn: async () => {
			let data;
			if (searchedName !== "") {
				data = await searchByName("events", searchedName, selectedCategory);
			} else if (selectedCategory) {
				data = await getByCategory("events", selectedCategory?.id);
			} else {
				data = await getAll("events");
				setSelectedCategory(null);
			}

			return data;
		},
		meta: { errorMessage: t("errors:errorFetchEvents") },
	});

	const openArticleDetails = (e) => {
		const id = e.currentTarget.id;
		navigate(`/events/${id}`);
	};

	async function filterByCategory(id) {
		const category = categories.find((el) => el.id === id);
		setSelectedCategory(category);
	}

	function resetFilter() {
		refetchEvents();
		setSelectedCategory(null);
		setSearchedName("");
	}

	return (
		<div className={css.articles}>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<CategoriesController
				categories={categories}
				setCategories={setCategories}
				apiClass="events"
				filterByCategory={filterByCategory}
				reloadData={refetchEvents}
				fullSize
			/>
			<ItemsController
				setSearchedName={setSearchedName}
				selectedCategory={selectedCategory}
				resetFilter={resetFilter}
				settingsConfig={{
					searchInput: t("searchTitle"),
					multiSelection: false,
					allItemsText: t("searchAll"),
				}}
			/>

			{isLoading ? (
				<ArticleCardLoader />
			) : (
				<section className={`${css.events_list} no-section`}>
					{events?.length > 0 ? (
						events.map((event) => (
							<article
								key={event.id}
								id={event.id}
								onClick={openArticleDetails}
							>
								<img
									src={`${publicPath}/images/events/${event.image}`}
									alt=""
								/>
								<div>
									<h3>{event.title}</h3>
									<p>{event.description}</p>
								</div>

								<div>
									<label>{makeDateFormat(event.date, "text")}</label>
								</div>

								<div>{isPermitted(event.active)}</div>
							</article>
						))
					) : (
						<NoDataFound text={t("noDataFound")} />
					)}
				</section>
			)}
			<PlusButton onClick={() => navigate(`/new-event/`)} />
		</div>
	);
};

export default Events;
