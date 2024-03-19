import { useEffect, useState } from "react";
import css from "./Notifications.module.css";
import { Helmet } from "react-helmet-async";
import PlusButton from "../../Components/basic/PlusButton";
import { getAll } from "../../modules/ApiFunctions";
import { isActive } from "../../modules/BasicFunctions";
import EditNotification from "./EditNotification";
import NewNotification from "./NewNotification";
import { AnimatePresence } from "framer-motion";

const Notifications = () => {
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
				<title>Upozornění | SmartAdminer</title>
			</Helmet>
			<section>
				<h2>Seznam upozornění</h2>
				{notifications?.length > 0 ? (
					<table>
						<thead>
							<tr>
								<th>Nadpis</th>
								<th>Text</th>
								<th>Adresa</th>
								<th>Stav</th>
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
					<p>Zatím nebyla přidána žádná upozornění</p>
				)}

				<EditNotification notification={editNotification} loadData={loadData} setEditNotification={setEditNotification} />
				<AnimatePresence>{showAddItemCont && <NewNotification loadData={loadData} setShowCreateNotification={setShowAddItemCont} />}</AnimatePresence>
			</section>
			<PlusButton onClick={showCreateNotification} />
		</div>
	);
};

export default Notifications;
