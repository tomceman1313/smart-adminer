import { useState } from "react";
import UserForm from "./UserForm";
import PlusButton from "../../Components/basic/PlusButton";

import { faAt, faCaretDown, faIdBadge, faMobileScreen, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useInteraction from "../../Hooks/useInteraction";
import css from "./Profiles.module.css";

export default function UserList({ users, roles, submitHandler, deleteHandler }) {
	const { setAlert } = useInteraction();
	const [userData, setUserData] = useState(null);
	const [activeUserInfo, setActiveUserInfo] = useState(null);

	const showUserDetail = async (id) => {
		let userData = await users.find((user) => user.id === id);
		setUserData(userData);
	};

	function privilegeToName(roleId) {
		const selectedRole = roles.find((role) => role.id === roleId);
		return selectedRole?.name ? selectedRole.name : "Neznámá role";
	}

	const deleteUser = (id, username) => {
		setAlert({ id: id, question: `Smazat uživatele ${username}?`, positiveHandler: deleteHandler });
	};

	return (
		<>
			<ul>
				{users.map((user) => (
					<li key={user.id}>
						<div>
							<label>
								<FontAwesomeIcon icon={faUser} />
								{user.username}
							</label>
							<label>{privilegeToName(user.role_id)}</label>
							<FontAwesomeIcon
								icon={faCaretDown}
								className={activeUserInfo === user.id ? `${css.show} ${css.rotate}` : css.show}
								onClick={() => setActiveUserInfo(user.id === activeUserInfo ? null : user.id)}
							/>
						</div>
						<article className={activeUserInfo === user.id ? css.active : ""}>
							{(user.lname || user.fname) && (
								<label>
									<FontAwesomeIcon icon={faIdBadge} />
									{user.fname + " " + user.lname}
								</label>
							)}
							{user.tel && (
								<label>
									<FontAwesomeIcon icon={faMobileScreen} /> {user.tel}
								</label>
							)}
							{user.email && (
								<label>
									<FontAwesomeIcon icon={faAt} /> {user.email}
								</label>
							)}
							<button onClick={() => showUserDetail(user.id)}>Upravit</button>
							<button onClick={() => deleteUser(user.id, user.username)}>Smazat</button>
						</article>
					</li>
				))}
			</ul>
			<PlusButton onClick={() => setUserData({})} />
			<UserForm userData={userData} roles={roles} close={() => setUserData(false)} submitHandler={submitHandler} />
		</>
	);
}
