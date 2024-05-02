import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import PlusButton from "../../components/basic/PlusButton";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";
import { isActive } from "../../modules/BasicFunctions";
import EditNotification from "./EditNotification";
import NewNotification from "./NewNotification";
import css from "./Notifications.module.css";

const Notifications = () => {
	const { t } = useTranslation("notifications");
	const { getAll } = useBasicApiFunctions();

	const [notifications, setNotifications] = useState(null);
	const [editNotification, setEditNotification] = useState(false);
	const [showAddItemCont, setShowAddItemCont] = useState(false);

	useEffect(() => {
		loadData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function loadData() {
		const data = await getAll("notifications");
		setNotifications(data);
	}

	const showCreateNotification = () => {
		setShowAddItemCont(true);
	};

	function showNotification(id) {
		const pickedNotification = notifications.filter((item) => item.id === id);
		setEditNotification(pickedNotification[0]);
	}

	return (
		<div className={css.notifications}>
			<Helmet>
				<title>{t("htmlTitle")}</title>
			</Helmet>
			<section>
				<h2>{t("headerNotificationsList")}</h2>
				{notifications?.length > 0 ? (
					<table>
						<thead>
							<tr>
								<th>{t("tableHeadTitle")}</th>
								<th>{t("tableHeadText")}</th>
								<th>{t("tableHeadUrl")}</th>
								<th>{t("tableHeadState")}</th>
							</tr>
						</thead>
						<tbody>
							{notifications.map((item) => (
								<tr key={item.id} onClick={() => showNotification(item.id)}>
									<td>{item.title}</td>
									<td>{item.text}</td>
									<td>{item.path}</td>
									<td>{isActive(item.start, item.end, css)}</td>
								</tr>
							))}
						</tbody>
					</table>
				) : (
					<p>{t("noDataFound")}</p>
				)}

				<EditNotification
					notification={editNotification}
					loadData={loadData}
					setEditNotification={setEditNotification}
				/>
				<AnimatePresence>
					{showAddItemCont && (
						<NewNotification
							loadData={loadData}
							setShowCreateNotification={setShowAddItemCont}
						/>
					)}
				</AnimatePresence>
			</section>
			<PlusButton onClick={showCreateNotification} />
		</div>
	);
};

export default Notifications;
