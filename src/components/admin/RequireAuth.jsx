import { Outlet } from "react-router-dom";

const RequireAuth = ({ permissions, permissionClass }) => {
	const permission = permissions.find((per) => per.class === permissionClass);
	// If permission class is empty string show section
	if (!permissionClass) {
		return <Outlet />;
	}

	if (
		permission?.get_permission ||
		permission?.post_permission ||
		permission?.put_permission ||
		permission?.delete_permission
	) {
		return <Outlet />;
	}

	return (
		<section>
			<h2 style={{ textAlign: "center" }}>Pro přístup nemáte práva</h2>
		</section>
	);
};

export default RequireAuth;
