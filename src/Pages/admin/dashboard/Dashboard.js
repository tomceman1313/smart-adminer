import { useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";

import SideMenu from "./SideMenu";
import Article from "../article/Article";
import Articles from "../articles/Articles";
import Notifications from "../notifications/Notifications";
import Pricelist from "../pricelist/Pricelist";
import Profile from "../profile/Profile";
import Profiles from "../profiles/Profiles";
import Register from "../register/Register";
import css from "./Dashboard.module.css";

import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RequireAuth from "../../Components/admin/RequireAuth";
import useAuth from "../../Hooks/useAuth";
import { refreshAccessToken } from "../../modules/ApiFunctions";
import useViewport from "../../Hooks/useViewport";
import Gallery from "../gallery/Gallery";
import Alert from "../../Components/admin/Alert";
import Message from "../../Components/admin/Message";

export default function Dashboard() {
	let navigate = useNavigate();
	const auth = useAuth();
	const { width } = useViewport();

	const ROLES = {
		user: 1,
		employee: 2,
		admin: 3,
	};

	useEffect(() => {
		if (auth.userInfo == null) {
			refreshAccessToken(navigate, auth);
			return;
		}
	}, [auth, navigate]);

	const logOut = () => {
		fetch("http://localhost:4300/api?class=admin&action=logout", {
			method: "GET",
			headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
			credentials: "include",
		}).then((response) => {
			if (response.status === 200) {
				auth.setUserInfo(null);
				return;
			}
		});
	};

	return (
		<div className={css.dashboard}>
			<SideMenu logOut={logOut} />
			<div className={css.banner}>
				<h1 id="banner-title">Přehled</h1>
				<p id="banner-desc">Nejdůležitější informace z chodu stránek</p>
				{width > 900 ? (
					<Link to="profile">
						<FontAwesomeIcon icon={faUser} />
					</Link>
				) : (
					<></>
				)}
			</div>
			<div className={css.content}>
				<Routes>
					<Route element={<RequireAuth allowedRoles={[ROLES.admin, ROLES.employee]} />}>
						<Route path="users" element={<Profiles />} />
						<Route path="register" element={<Register />} />
						<Route path="pricelist" element={<Pricelist />} />
						<Route path="notifications" element={<Notifications />} />
						<Route path="gallery" element={<Gallery />} />
					</Route>
					<Route element={<RequireAuth allowedRoles={[ROLES.user, ROLES.employee, ROLES.admin]} />}>
						<Route path="profile" element={<Profile />} />
						<Route path="articles" element={<Articles />} />
						<Route path="article" element={<Article />} />
						<Route path="new-article" element={<Article />} />
						<Route path="article/:id" element={<Article />} />
					</Route>
				</Routes>
				<Alert />
				<Message />
			</div>
		</div>
	);
}
