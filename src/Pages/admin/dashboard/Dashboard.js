import { useEffect } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import SideMenu from "./SideMenu";
import Article from "../article/Article";
import Articles from "../articles/Articles";
import Notifications from "../notifications/Notifications";
import Pricelist from "../pricelist/Pricelist";
import Profile from "../profile/Profile";
import Profiles from "../profiles/Profiles";
import Register from "../register/Register";
import Gallery from "../gallery/Gallery";
import Alert from "../../Components/admin/Alert";
import Message from "../../Components/admin/Message";
import Documents from "../documents/Documents";
import Event from "../events/Event";
import Events from "../events/Events";
import Products from "../products/Products";
import Product from "../product/Product";

import css from "./Dashboard.module.css";

import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RequireAuth from "../../Components/admin/RequireAuth";
import useAuth from "../../Hooks/useAuth";
import { refreshAccessToken, BASE_URL } from "../../modules/ApiFunctions";
import useViewport from "../../Hooks/useViewport";
import Vacancies from "../vacancies/Vacancies";
import Vacancy from "../vacancy/Vacancy";
import Employees from "../employees/Employees";

export default function Dashboard() {
	const navigate = useNavigate();
	const location = useLocation();
	const auth = useAuth();
	const { width } = useViewport();

	const ROLES = {
		user: 1,
		employee: 2,
		admin: 3,
	};

	useEffect(() => {
		if (auth.userInfo == null) {
			refreshAccessToken(navigate, location.pathname, auth);
			return;
		}
	}, [auth, navigate, location]);

	const logOut = () => {
		fetch(`${BASE_URL}/api/?class=admin&action=logout`, {
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
						<Route path="gallery/:page" element={<Gallery />} />
						<Route path="documents" element={<Documents />} />
						<Route path="products" element={<Products />} />
						<Route path="new-product" element={<Product />} />
						<Route path="product/:id" element={<Product />} />
						<Route path="vacancies" element={<Vacancies />} />
						<Route path="vacancy" element={<Vacancy />} />
						<Route path="vacancy/:id" element={<Vacancy />} />
						<Route path="employees" element={<Employees />} />
					</Route>
					<Route element={<RequireAuth allowedRoles={[ROLES.user, ROLES.employee, ROLES.admin]} />}>
						<Route path="profile" element={<Profile />} />
						<Route path="articles" element={<Articles />} />
						<Route path="new-article" element={<Article />} />
						<Route path="article/:id" element={<Article />} />
						<Route path="events" element={<Events />} />
						<Route path="new-event" element={<Event />} />
						<Route path="event/:id" element={<Event />} />
					</Route>
				</Routes>
				<Alert />
				<Message />
			</div>
		</div>
	);
}
