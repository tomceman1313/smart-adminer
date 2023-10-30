import { useState } from "react";
import UserForm from "./UserForm";

import { faAt, faCaretDown, faIdBadge, faMobileScreen, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useInteraction from "../../Hooks/useInteraction";

function privilegeToName(privilege) {
	switch (privilege) {
		case 1:
			return "Uživatel";
		case 2:
			return "Zaměstnanec";
		case 3:
			return "Admin";
		default:
			return "Uživatel";
	}
}

export default function UserList({ data, handleEdit, handleDelete, css }) {
	const { setAlert } = useInteraction();
	const [show, setShow] = useState(false);

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

	const userData = async (id) => {
		let userData = await data.find((user) => user.id === id);
		setShow(userData);
	};

	const deleteUser = (id, username) => {
		setAlert({ id: id, question: `Smazat uživatele ${username}?`, positiveHandler: handleDelete });
	};

	return (
		<div style={{ position: "relative" }}>
			<ul>
				{data.map((user) => (
					<li key={user.id}>
						<div>
							<label>
								<FontAwesomeIcon icon={faUser} />
								{user.username}
							</label>
							<label>{privilegeToName(user.privilege)}</label>
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
							<button onClick={() => userData(user.id)}>Upravit</button>
							<button onClick={() => deleteUser(user.id, user.username)}>Smazat</button>
						</article>
					</li>
				))}
			</ul>
			<UserForm userData={show} setState={setShow} handleEdit={handleEdit} />
		</div>
	);
}
