import Permission from "./Permission";

export default function PermissionsTable({ permissions, togglePermissionHandler }) {
	return (
		<table>
			<thead>
				<tr>
					<th>Oblast</th>
					<th>Čtení</th>
					<th>Vytváření</th>
					<th>Upravování</th>
					<th>Odstraňování</th>
				</tr>
			</thead>
			<tbody>
				{permissions.map((permission) => (
					<tr key={`permission-${permission.id}`}>
						<td>{permission.class}</td>
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
