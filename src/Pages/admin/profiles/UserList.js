import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faUser, faIdBadge, faMobileScreen, faAt, faArrowUpWideShort, faLock, faImagePortrait, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";

function UserList({ data, handleEdit, css, setCheckMessage }) {
	const { register, handleSubmit, reset } = useForm();

	const [show, setShow] = useState(false);
	const [userId, setId] = useState(0);

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
				break;
		}
	};

	const showMoreInfo = (e) => {
		const el = e.target.parentNode;

		const ee = 1;
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

	const editVisibility = () => {
		let parent = document.querySelector(`.${css.edit}`);
		parent.style.animationName = `${css.hide}`;

		setTimeout(() => {
			let list = document.querySelector(`.${css.users} ul`);
			list.style.opacity = 1;
			setShow(false);
		}, 1000);
	};

	const onSubmit = (data) => {
		handleEdit(data);
		setShow(false);
	};

	const ContObj = () => {
		let userData = data.filter((user) => {
			return user.id === userId;
		});

		let list = document.querySelector(`.${css.users} ul`);
		list.style.opacity = 0.1;

		return (
			<section className={css.edit}>
				<h2>{userData[0].username}</h2>
				<FontAwesomeIcon id={css.close} icon={faXmark} onClick={editVisibility} />
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className={css.input_box}>
						<input type="text" placeholder="Uživatelské jméno" {...register("username")} defaultValue={userData[0].username} />
						<FontAwesomeIcon className={css.icon} icon={faUser} />
					</div>

					<div className={css.input_box}>
						<input type="text" placeholder="Jméno" {...register("fname")} defaultValue={userData[0].fname} />
						<FontAwesomeIcon className={css.icon} icon={faImagePortrait} />
					</div>

					<div className={css.input_box}>
						<input type="text" placeholder="Příjmení" {...register("lname")} defaultValue={userData[0].lname} />
						<FontAwesomeIcon className={css.icon} icon={faIdBadge} />
					</div>

					<div className={css.input_box}>
						<input type="phone" placeholder="Telefon" {...register("tel")} defaultValue={userData[0].tel} />
						<FontAwesomeIcon className={css.icon} icon={faMobileScreen} />
					</div>

					<div className={css.input_box}>
						<input type="email" placeholder="Email" {...register("email")} defaultValue={userData[0].email} />
						<FontAwesomeIcon className={css.icon} icon={faAt} />
					</div>

					<div className={css.input_box}>
						<select defaultValue={userData[0].privilege} {...register("privilege")}>
							<option value="default" disabled>
								-- Práva nového účtu --
							</option>
							<option value="1">Uživatel</option>
							<option value="2">Zaměstnanec</option>
							<option value="3">Admin</option>
						</select>
						<FontAwesomeIcon className={css.icon} icon={faArrowUpWideShort} />
					</div>

					<input type="hidden" defaultValue={userData[0].id} {...register("id")} />

					<input type="submit" />
				</form>
			</section>
		);
	};

	const showEditCont = (id) => {
		reset();
		setId(id);
		setShow(!show);
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
							<button onClick={() => showEditCont(user.id)}>Upravit</button>
							<button onClick={() => setCheckMessage({ id: user.id })}>Smazat</button>
						</article>
					</li>
				))}
			</ul>
			{show && <ContObj />}
		</div>
	);
}

export default UserList;
