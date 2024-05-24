import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Alert from "../../components/admin/Alert";
import Message from "../../components/admin/Message";
import RequireAuth from "../../components/admin/RequireAuth";
import Banner from "../../components/banner/Banner";
import DesktopMenu from "../../components/menu/desktop-menu/DesktopMenu";
import MobileMenu from "../../components/menu/mobile-menu/MobileMenu";
import { ROUTES } from "../../components/menu/routes";
import useAuth from "../../hooks/useAuth";
import useViewport from "../../hooks/useViewport";

import ImageEditor from "../../components/common/image-editor/ImageEditor";
import useAuthApi from "../../hooks/api/useAuthApi";
import ErrorPage from "../error/ErrorPage";
import css from "./Dashboard.module.css";

export default function Dashboard() {
	const auth = useAuth();
	const { refreshAccessToken, logOut } = useAuthApi();
	const { width } = useViewport();

	useEffect(() => {
		if (auth.userInfo == null) {
			refreshAccessToken();
			return;
		}
	}, [auth, refreshAccessToken]);

	function getAccessRights() {
		let accessRights = {};
		auth?.userInfo?.permissions.forEach((permission) => {
			let accessGranted = false;
			if (
				permission.get_permission ||
				permission.post_permission ||
				permission.put_permission ||
				permission.delete_permission
			) {
				accessGranted = true;
			}
			accessRights[permission.class] = accessGranted;
		});
		return accessRights;
	}

	return (
		<div className={css.dashboard}>
			{auth?.userInfo?.permissions && (
				<>
					{width > 1600 ? (
						<DesktopMenu
							permissions={getAccessRights()}
							logOut={() => logOut()}
						/>
					) : (
						<MobileMenu
							permissions={getAccessRights()}
							logOut={() => logOut()}
						/>
					)}

					<Banner />
					<div className={css.content}>
						<Routes>
							{ROUTES.map((route) => (
								<Route
									key={route.name}
									element={
										<RequireAuth
											permissions={auth.userInfo.permissions}
											permissionClass={route.class}
										/>
									}
								>
									<Route path={route.path} element={route.element} />
								</Route>
							))}
							<Route path="/*" element={<ErrorPage errorCode={404} />} />
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
