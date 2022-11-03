import { useContext, useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";

import SideMenu from "../../Components/admin/SideMenu";
import Article from "../article/Article";
import Articles from "../articles/Articles";
import Notifications from "../notifications/Notifications";
import Pricelist from "../pricelist/Pricelist";
import Profile from "../profile/Profile";
import Profiles from "../users/Profiles";
import Register from "../users/Register";
import css from "./Dashboard.module.css";

import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AuthContext from "../../context/AuthContext";

export default function Dashboard() {
	let navigate = useNavigate();
	const user = useContext(AuthContext);

	useEffect(() => {
		if (user.userInfo == null) {
			refreshAccessToken();
			// navigate("/login");
			// return;
		}
	}, [user]);

	const logOut = () => {
		fetch("http://localhost:4300/api?class=admin&action=logout", {
			method: "GET",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			credentials: "include",
		}).then((response) => {
			if (response.status === 200) {
				console.log("Logged out");
				user.setUserInfo(null);
				return;
			}
		});
	};

	const refreshAccessToken = () => {
		fetch("http://localhost:4300/api?class=admin&action=refresh", {
			method: "GET",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			credentials: "include",
		}).then((response) => {
			if (response.status === 403) {
				navigate("/login");
				return;
			}
			response.text().then((_data) => {
				let data = JSON.parse(_data);
				user.setUserInfo(data.token);
			});
		});
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
					<Route path="articles" element={<Articles />} />
					<Route path="article" element={<Article />} />
					<Route path="new-article" element={<Article />} />
					<Route path="article/:id" element={<Article />} />
				</Routes>
			</div>
		</div>
	);
}
