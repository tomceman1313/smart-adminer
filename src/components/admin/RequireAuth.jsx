import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ children, permissionClass }) => {
	const auth = useAuth();
	const permission = auth.userInfo.permissions.find(
		(per) => per.class === permissionClass
	);
	// If permission class is empty string show section
	if (!permissionClass) {
		return children;
	}

	if (
		permission?.get_permission ||
		permission?.post_permission ||
		permission?.put_permission ||
		permission?.delete_permission
	) {
		return children;
	}

	return (
		<section>
			<h2 style={{ textAlign: "center" }}>Pro přístup nemáte práva</h2>
		</section>
	);
};

export default RequireAuth;
