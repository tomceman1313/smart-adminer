import { useState } from "react";
import UserForm from "./UserForm";
import PlusButton from "../../components/basic/PlusButton";

import {
	faAt,
	faCaretDown,
	faIdBadge,
	faMobileScreen,
	faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useInteraction from "../../hooks/useInteraction";
import { useTranslation } from "react-i18next";
import css from "./Profiles.module.css";
import { AnimatePresence } from "framer-motion";

export default function UserList({
	users,
	roles,
	submitHandler,
	deleteHandler,
}) {
	const { setAlert } = useInteraction();
	const { t } = useTranslation("profiles");
	const [userData, setUserData] = useState(null);
	const [activeUserInfo, setActiveUserInfo] = useState(null);

	const showUserDetail = async (id) => {
		let userData = await users.find((user) => user.id === id);
		setUserData(userData);
	};

	function privilegeToName(roleId) {
		const selectedRole = roles.find((role) => role.id === roleId);
		return selectedRole?.name ? selectedRole.name : t("unknownRole");
	}

	const deleteUser = (id, username) => {
		setAlert({
			id: id,
			question: t("alertDeleteUser", { username: username }),
			positiveHandler: deleteHandler,
		});
	};

	return (
		<>
			<ul className={css.users_list}>
				{users.map((user) => (
					<li key={`user-${user.id}`}>
						<div>
							<label>
								<FontAwesomeIcon icon={faUser} />
								{user.username}
							</label>
							<label>{privilegeToName(user.role_id)}</label>
							<FontAwesomeIcon
								icon={faCaretDown}
								className={
									activeUserInfo === user.id
										? `${css.show} ${css.rotate}`
										: css.show
								}
								onClick={() =>
									setActiveUserInfo(user.id === activeUserInfo ? null : user.id)
								}
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
							<button onClick={() => showUserDetail(user.id)}>
								{t("editButton")}
							</button>
							<button onClick={() => deleteUser(user.id, user.username)}>
								{t("deleteButton")}
							</button>
						</article>
					</li>
				))}
			</ul>
			<PlusButton onClick={() => setUserData({})} />
			<AnimatePresence>
				{userData && (
					<UserForm
						userData={userData}
						roles={roles}
						close={() => setUserData(false)}
						submitHandler={submitHandler}
					/>
				)}
			</AnimatePresence>
		</>
	);
}
