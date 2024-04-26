import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import useAuthApi from "../../hooks/api/useAuthApi";
import PermissionsTable from "./PermissionsTable";
import css from "./Roles.module.css";
import RolesController from "./RolesController";
import AddNewPermissionClassForm from "./AddNewPermissionClassForm";
import useBasicApiFunctions from "../../hooks/api/useBasicApiFunctions";

function assignPermissionsToRole(roles, permissions) {
	return roles.map((role) => {
		role.permissions = permissions.filter(
			(permission) => permission.role_id === role.id
		);
		return role;
	});
}

export default function Roles() {
	const { t } = useTranslation("profiles");
	const { togglePermission } = useAuthApi();
	const { getAll, getAllWithAuth } = useBasicApiFunctions();

	const { data: roles, refetch } = useQuery({
		queryKey: ["roles"],
		queryFn: async () => {
			const _roles = await getAll("users/roles");
			const _permissions = await getAllWithAuth("users/permissions");
			return assignPermissionsToRole(_roles, _permissions);
		},
	});

	async function togglePermissionHandler(permission_id, method) {
		await togglePermission(
			permission_id,
			method,
			t("permissionTogglePositiveText")
		);
		refetch();
	}

	return (
		<div className={css.roles}>
			<Helmet>
				<title>{t("htmlRolesTitle")}</title>
			</Helmet>

			<RolesController roles={roles} reload={refetch} />
			<AddNewPermissionClassForm />

			<section>
				<ul className={css.permissions_table}>
					{roles &&
						roles.map((role) => (
							<li key={`${role.name}-${role.id}`}>
								<strong>{role.name}</strong>
								<div style={{ overflowX: "auto" }}>
									<PermissionsTable
										permissions={role.permissions}
										togglePermissionHandler={togglePermissionHandler}
									/>
								</div>
							</li>
						))}
				</ul>
			</section>
		</div>
	);
}
