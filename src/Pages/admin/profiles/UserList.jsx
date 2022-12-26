import { useState } from "react";
import UserForm from "./UserForm";

import { faAt, faCaretDown, faIdBadge, faMobileScreen, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function UserList({ data, handleEdit, css, setCheckMessage }) {
	const [show, setShow] = useState(false);

	const privilegeToName = (privilege) => {
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
	};

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
		let userData = await data.filter((user) => {
			return user.id === id;
		});
		setShow(userData);
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
							<label>
								{/* <FontAwesomeIcon icon={faArrowUpWideShort} /> */}
								{privilegeToName(user.privilege)}
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
							<button onClick={() => userData(user.id)}>Upravit</button>
							<button onClick={() => setCheckMessage({ id: user.id })}>Smazat</button>
						</article>
					</li>
				))}
			</ul>
			<UserForm userData={show} setState={setShow} handleEdit={handleEdit} />
		</div>
	);
}

export default UserList;
