import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Alert from "../../components/admin/Alert";
import Message from "../../components/admin/Message";
import RequireAuth from "../../components/admin/RequireAuth";
import useAuth from "../../hooks/useAuth";
import useViewport from "../../hooks/useViewport";
import { logOut, refreshAccessToken } from "../../modules/ApiAuth";
import Banner from "./Banner";
import DesktopMenu from "./desktop-menu/DesktopMenu";
import MobileMenu from "./mobile-menu/MobileMenu";
import { ROUTES } from "./routes";

import ImageEditor from "../../components/common/image-editor/ImageEditor";
import { getAllWithAuth } from "../../modules/ApiFunctions";
import css from "./Dashboard.module.css";

export default function Dashboard() {
	const auth = useAuth();
	const { width } = useViewport();
	const navigate = useNavigate();
	const location = useLocation();

	const [permissions, setPermissions] = useState(null);

	useEffect(() => {
		if (auth.userInfo == null) {
			refreshAccessToken(navigate, location.pathname, auth);
			return;
		}
		loadPermissions();

		async function loadPermissions() {
			const _permissions = await getAllWithAuth(`users/roles/${auth.userInfo.role}/permissions`, auth);
			setPermissions(_permissions);
		}
	}, [auth, navigate, location]);

	function permissionsToPagesAccessRights() {
		let accessRights = {};
		permissions.forEach((permission) => {
			let accessGranted = false;
			if (permission.get_permission || permission.post_permission || permission.put_permission || permission.delete_permission) {
				accessGranted = true;
			}
			accessRights[permission.class] = accessGranted;
		});
		return accessRights;
	}

	return (
		<div className={css.dashboard}>
			{permissions && (
				<>
					<Helmet>
						<title>SmartAdminer</title>
					</Helmet>

					{width > 1600 ? (
						<DesktopMenu permissions={permissionsToPagesAccessRights()} logOut={() => logOut(auth)} />
					) : (
						<MobileMenu permissions={permissionsToPagesAccessRights()} logOut={() => logOut(auth)} />
					)}

					<Banner />
					<div className={css.content}>
						<Routes>
							{ROUTES.map((route) => (
								<Route key={route.name} element={<RequireAuth permissions={permissions} permissionClass={route.class} />}>
									<Route path={route.path} element={route.element} />
								</Route>
							))}
						</Routes>
						<Alert />
						<Message />
						<ImageEditor />
					</div>
				</>
			)}
		</div>
	);
}
