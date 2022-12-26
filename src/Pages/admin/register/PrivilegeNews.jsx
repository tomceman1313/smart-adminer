import React from "react";

const PrivilegeTable = ({ css, privileges, isPermitted }) => {
	return (
		<div className={css.roles}>
			<h3>Notifikace</h3>
			<table>
				<thead>
					<tr>
						<th>Role</th>
						<th>Vytvoření</th>
						<th>Editace</th>
						<th>Publikování</th>
					</tr>
				</thead>

				<tbody>
					{privileges.map((role) => (
						<tr key={role.role}>
							<td>{role.name}</td>
							<td>{isPermitted(role.create_news)}</td>
							<td>{isPermitted(role.edit_news)}</td>
							<td>{isPermitted(role.post_news)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default PrivilegeTable;
