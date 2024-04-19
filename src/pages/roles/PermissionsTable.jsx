import { useTranslation } from "react-i18next";
import Permission from "./Permission";

export default function PermissionsTable({ permissions, togglePermissionHandler }) {
	const { t } = useTranslation(["profiles", "privileges"]);

	return (
		<table>
			<thead>
				<tr>
					<th>{t("tableHeadSection")}</th>
					<th>{t("tableHeadRead")}</th>
					<th>{t("tableHeadCreate")}</th>
					<th>{t("tableHeadUpdate")}</th>
					<th>{t("tableHeadDelete")}</th>
				</tr>
			</thead>
			<tbody>
				{permissions.map((permission) => (
					<tr key={`permission-${permission.id}`}>
						<td>{t(`privileges:${permission.class}`)}</td>
						<Permission permission={permission.get_permission} clickHandler={() => togglePermissionHandler(permission.id, "get")} />
						<Permission permission={permission.post_permission} clickHandler={() => togglePermissionHandler(permission.id, "post")} />
						<Permission permission={permission.put_permission} clickHandler={() => togglePermissionHandler(permission.id, "put")} />
						<Permission permission={permission.delete_permission} clickHandler={() => togglePermissionHandler(permission.id, "delete")} />
					</tr>
				))}
			</tbody>
		</table>
	);
}
