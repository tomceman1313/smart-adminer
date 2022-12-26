import React from "react";

const PrivilegeTable = ({ css, privileges, isPermitted }) => {
	return (
		<div className={css.roles}>
			<h3>Ceník</h3>
			<table>
				<thead>
					<tr>
						<th>Role</th>
						<th>Úprava cen</th>
						<th>Tvorba nové položky</th>
					</tr>
				</thead>

				<tbody>
					{privileges.map((role) => (
						<tr key={role.role}>
							<td>{role.name}</td>
							<td>{isPermitted(role.edit_prices)}</td>
							<td>{isPermitted(role.create_pricelist_item)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default PrivilegeTable;
