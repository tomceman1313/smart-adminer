import { Outlet } from "react-router-dom";

const RequireAuth = ({ permissions, permissionClass }) => {
	const permission = permissions.find((per) => per.class === permissionClass);

	if (permission.get_permission || permission.post_permission || permission.put_permission || permission.delete_permission) {
		return <Outlet />;
	}

	return <p>Pro přístup nemáte práva</p>;
};

export default RequireAuth;
