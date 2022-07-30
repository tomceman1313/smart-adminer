function UserList({ data, handleDelete }) {
	return (
		<ul>
			{data.map((user) => (
				<li key={user.id}>
					<label>{user.username}</label>
					<label>{user.fname + " " + user.lname}</label>
					<label>{user.tel}</label>
					<label>{user.email}</label>
					<label>{user.privilege}</label>
					<button onClick={() => handleDelete(user.id)}>Smazat</button>
				</li>
			))}
		</ul>
	);
}

export default UserList;
