import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Alert from "../../Components/admin/Alert";
import Message from "../../Components/admin/Message";
import Article from "../article/Article";
import Articles from "../articles/Articles";
import Documents from "../documents/Documents";
import Event from "../events/Event";
import Events from "../events/Events";
import Gallery from "../gallery/Gallery";
import Notifications from "../notifications/Notifications";
import Pricelist from "../pricelist/Pricelist";
import Product from "../product/Product";
import Products from "../products/Products";
import Profile from "../profile/Profile";
import Profiles from "../profiles/Profiles";
import Register from "../register/Register";
import SideMenu from "./SideMenu";
import RequireAuth from "../../Components/admin/RequireAuth";
import useAuth from "../../Hooks/useAuth";
import { refreshAccessToken } from "../../modules/ApiFunctions";
import Employees from "../employees/Employees";
import Orders from "../orders/Orders";
import Pages from "../pages/Pages";
import Vacancies from "../vacancies/Vacancies";
import Vacancy from "../vacancy/Vacancy";
import Banner from "./Banner";

import css from "./Dashboard.module.css";
import Page from "../page/Page";

export default function Dashboard() {
	const navigate = useNavigate();
	const location = useLocation();
	const auth = useAuth();

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

	return (
		<div className={css.dashboard}>
			<SideMenu auth={auth} />
			<Banner />
			<div className={css.content}>
				<Routes>
					<Route element={<RequireAuth allowedRoles={[ROLES.admin, ROLES.employee]} />}>
						<Route path="users" element={<Profiles />} />
						<Route path="register" element={<Register />} />
						<Route path="pages" element={<Pages />} />
						<Route path="page/:id" element={<Page />} />
						<Route path="gallery" element={<Gallery />} />
						<Route path="gallery/:page" element={<Gallery />} />
						<Route path="documents" element={<Documents />} />
						<Route path="pricelist" element={<Pricelist />} />
						<Route path="notifications" element={<Notifications />} />
						<Route path="products" element={<Products />} />
						<Route path="new-product" element={<Product />} />
						<Route path="product/:id" element={<Product />} />
						<Route path="orders" element={<Orders />} />
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
