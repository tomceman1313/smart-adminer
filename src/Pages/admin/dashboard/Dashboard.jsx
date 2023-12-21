import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Alert from "../../Components/admin/Alert";
import Message from "../../Components/admin/Message";
import RequireAuth from "../../Components/admin/RequireAuth";
import useAuth from "../../Hooks/useAuth";
import { refreshAccessToken } from "../../modules/ApiAuth";
import Banner from "./Banner";
import SideMenu from "./SideMenu";
import { ROUTES } from "./routes";

import css from "./Dashboard.module.css";

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
			<Helmet>
				<title>SmartAdminer</title>
			</Helmet>
			<SideMenu auth={auth} />
			<Banner />
			<div className={css.content}>
				<Routes>
					{ROUTES.map((route) => (
						<Route key={route.name} element={<RequireAuth allowedRoles={[ROLES.admin, ROLES.employee]} />}>
							<Route path={route.path} element={route.element} />
						</Route>
					))}
				</Routes>
				<Alert />
				<Message />
			</div>
		</div>
	);
}
