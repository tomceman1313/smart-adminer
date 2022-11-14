import { useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
	const auth = useAuth();
	const location = useLocation();

	const refreshAccessToken = () => {
		// fetch(`http://localhost:4300/api?class=admin&action=refresh`, {
		// 	method: "GET",
		// 	headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
		// 	credentials: "include",
		// }).then((response) => {
		// 	if (response.status === 403) {
		// 		auth.setUserInfo(null);
		// 		return <Navigate to="/login" state={{ from: location }} replace />;
		// 	}
		// 	response.text().then((_data) => {
		// 		let data = JSON.parse(_data);
		// 		auth.setUserInfo(data.token);
		// 	});
		// });

		auth.setUserInfo(null);
	};

	//return auth.userInfo?.role?.find((role) => allowedRoles?.inclueds(role)) ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
	//return allowedRoles.find((role) => role === auth?.userInfo?.role) ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;

	return allowedRoles.find((role) => role === auth?.userInfo?.role) ? <Outlet /> : <p>Pro přístup nemáte práva</p>;
};

export default RequireAuth;
