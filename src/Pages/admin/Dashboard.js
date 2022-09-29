import { useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";

import css from "./styles/Dashboard.module.css";
import SideMenu from "../Components/admin/SideMenu";
import Register from "./Register";
import Profiles from "./Profiles";
import Pricelist from "./Pricelist";
import Profile from "./Profile";
import Notifications from "./Notifications";

import { useSelector, useDispatch } from "react-redux";
import { deleteKey } from "../../redux/authKey";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
	const apiKey = useSelector((state) => state.auth.apiKey);
	let navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		// if (apiKey == null) {
		// 	navigate("/login");
		// }
	}, [apiKey]);

	const logOut = () => {
		dispatch(deleteKey());
	};

	return (
		<div className={css.dashboard}>
			<SideMenu logOut={logOut} />
			<div className={css.banner}>
				<h1 id="banner-title">Přehled</h1>
				<p id="banner-desc">Nejdůležitější informace z chodu stránek</p>
				<Link to="profile">
					<FontAwesomeIcon icon={faUser} />
				</Link>
			</div>
			<div className={css.content}>
				<Routes>
					<Route path="users" element={<Profiles />} />
					<Route path="register" element={<Register />} />
					<Route path="pricelist" element={<Pricelist />} />
					<Route path="profile" element={<Profile />} />
					<Route path="notifications" element={<Notifications />} />
				</Routes>
			</div>
		</div>
	);
}
