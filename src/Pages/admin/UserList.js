import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faUser, faIdBadge, faMobileScreen, faAt, faArrowUpWideShort } from "@fortawesome/free-solid-svg-icons";

function UserList({ data, handleDelete, css }) {
	let dataPrivileges = data.map((user) => {
		switch (user.privilege) {
			case 1:
				user.privilege = "Uživatel";
				break;
			case 2:
				user.privilege = "Zaměstnanec";
				break;

			case 3:
				user.privilege = "Admin";
				break;

			default:
				user.privilege = "Uživatel";
				break;
		}
		return user;
	});

	const showMoreInfo = (e) => {
		const el = e.target.parentNode;
		const article = el.parentNode.childNodes[1];

		const arrow = e.target.firstChild;

		if (article.classList.contains(css.active)) {
			article.classList.remove(css.active);
			arrow.classList.remove(css.rotate);
		} else {
			article.classList.add(css.active);
			arrow.classList.add(css.rotate);
		}
	};

	return (
		<ul>
			{dataPrivileges.map((user) => (
				<li key={user.id}>
					<div>
						<label>
							<FontAwesomeIcon icon={faUser} />
							{user.username}
						</label>
						<label>
							{/* <FontAwesomeIcon icon={faArrowUpWideShort} /> */}
							{user.privilege}
						</label>
						<FontAwesomeIcon icon={faCaretDown} className={css.show} onClick={showMoreInfo} />
					</div>
					<article>
						<label>
							<FontAwesomeIcon icon={faIdBadge} />
							{user.fname + " " + user.lname}
						</label>
						<label>
							<FontAwesomeIcon icon={faMobileScreen} /> {user.tel}
						</label>
						<label>
							<FontAwesomeIcon icon={faAt} /> {user.email}
						</label>
						<button onClick={() => handleDelete(user.id)}>Upravit</button>
						<button onClick={() => handleDelete(user.id)}>Smazat</button>
					</article>
				</li>
			))}
		</ul>
	);
}

export default UserList;
