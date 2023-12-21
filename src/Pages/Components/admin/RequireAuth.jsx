import { Outlet } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
	const auth = useAuth();
	// const location = useLocation();

	//return auth.userInfo?.role?.find((role) => allowedRoles?.inclueds(role)) ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
	//return allowedRoles.find((role) => role === auth?.userInfo?.role) ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;

	return allowedRoles.find((role) => role === auth?.userInfo?.role) ? <Outlet /> : <p>Pro přístup nemáte práva</p>;
};

export default RequireAuth;
