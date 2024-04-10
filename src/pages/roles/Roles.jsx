import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import useAuth from "../../hooks/useAuth";
import useInteraction from "../../hooks/useInteraction";
import { getAll, getAllWithAuth } from "../../modules/ApiFunctions";
import { togglePermission } from "../../modules/ApiAuth";
import PermissionsTable from "./PermissionsTable";
import css from "./Roles.module.css";
import { useTranslation } from "react-i18next";

function assignPermissionsToRole(roles, permissions) {
	return roles.map((role) => {
		role.permissions = permissions.filter((permission) => permission.role_id === role.id);
		return role;
	});
}

export default function Roles() {
	const auth = useAuth();
	const { setMessage } = useInteraction();
	const { t } = useTranslation("profiles");

	const [roles, setRoles] = useState(null);

	useEffect(() => {
		loadData();

		async function loadData() {
			const _roles = await getAll("users/roles");
			const _permissions = await getAllWithAuth("users/permissions", auth);
			setRoles(assignPermissionsToRole(_roles, _permissions));
		}
	}, [auth]);

	async function togglePermissionHandler(permission_id, method) {
		await togglePermission(permission_id, method, setMessage, t("permissionTogglePositiveText"), auth);
	}

	return (
		<div className={css.roles}>
			<Helmet>
				<title>{t("htmlRolesTitle")}</title>
			</Helmet>

			<section>
				<ul>
					{roles &&
						roles.map((role) => (
							<li key={`${role.name}-${role.id}`}>
								<strong>{role.name}</strong>
								<div style={{ overflowX: "auto" }}>
									<PermissionsTable permissions={role.permissions} togglePermissionHandler={togglePermissionHandler} />
								</div>
							</li>
						))}
				</ul>
			</section>
		</div>
	);
}
